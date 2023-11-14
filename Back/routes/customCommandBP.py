from flask import Blueprint, jsonify,request
import paramiko
from sqlalchemy.orm import aliased
from models.history import History
from models.command import Command
from models.option import Option
from models.baseOS import BaseOsys
from models.machine import Machine
from models.OS import OSys
from models.attribution import Attribution
from database import db
from .ssh_manager import ssh_clients
from datetime import datetime
import jwt
from flask import current_app as app

custom_cmd_bp = Blueprint('custom_cmd-bp', __name__)

@custom_cmd_bp.route('/launch-command/<int:machine_id>', methods=['POST'])
def command_fromDb(machine_id):
    if machine_id in ssh_clients:
        data = request.json
        ssh = ssh_clients.get(machine_id)

        token = request.headers.get('Authorization').split(' ')[1]

        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            admin_id = payload.get('admin_id')
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        commandName = db.session.query(Command.commandName).filter_by(idCommand=data.get('selectedOption')).first()[0]
        optionSyntax = db.session.query(Option.optionSyntax).filter_by(idOption=data.get('selectedSecondOption')).first()[0]
        if optionSyntax is None:
            command = f"{commandName} {data.get('inputData')}"
        else:
            command = f"{commandName} {optionSyntax} {data.get('inputData')}"
        print(command)
        try:
            stdin, stdout, stderr = ssh.exec_command(command)

            exit_status = stdout.channel.recv_exit_status()

            if exit_status == 0:
                history = History(target=data.get('inputData'), idAdmin=admin_id, idMachine=machine_id,
                                  idOption=data.get("selectedSecondOption"), dateHistory=datetime.now())
                db.session.add(history)
                db.session.commit()
                return jsonify({"message": "Command executed successfully"})
            else:
                return jsonify({"error": f"Command failed with exit status {exit_status}"}), 502
        except paramiko.SSHException as e:
            return jsonify({"error": str(e)}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 501
    else:
        return jsonify({"error": "Machine not found"}), 404
    
@custom_cmd_bp.route('/execute-command/<int:machine_id>', methods=['POST'])
def exec_term_command(machine_id):
    if machine_id in ssh_clients:
        ssh = ssh_clients.get(machine_id)

        command = request.json['command']

        stdin, stdout, stderr = ssh.exec_command(command)
        output = stdout.read()
        error = stderr.read()

        if error:
            return error.decode('utf-8')

        return output.decode('utf-8')
    else:
        return 'SSH client not available'
    
@custom_cmd_bp.route('/update/<int:user_id>', methods=['GET'])
def update_machine(user_id):
    try:
        ssh = ssh_clients.get(user_id)
        if ssh is None:
            return jsonify({"error": "SSH client not found for machine ID"}), 405

        attribution_alias = aliased(Attribution, name="attribution_machine")

        command_query = db.session.query(
            Command.commandName,
            Option.optionSyntax
        ).join(
            Option,
            Command.idCommand == Option.idOption
        ).join(
            BaseOsys,
            Command.idBaseOsys == BaseOsys.idBaseOsys
        ).join(
            OSys,
            BaseOsys.idBaseOsys == OSys.baseOS
        ).join(
            Machine,
            OSys.idOS == Machine.idOS
        ).join(
            attribution_alias,
            Machine.idMachine == attribution_alias.idMachine
        ).filter(
            Option.optionDescription == "Update all",
            attribution_alias.idUser == user_id
        ).first()


        if command_query is None:
            return jsonify({"error": "Update command not found"}), 404

        print(command_query.commandName)
        print(command_query.optionSyntax)

        # command_string = f"{command_name} {command_syntax}"
        # stdin, stdout, stderr = ssh.exec_command(command_string)

        return jsonify({"message": "Update command executed successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

