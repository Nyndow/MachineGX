from flask import Blueprint, jsonify,request
import paramiko
from models.history import History
from models.command import Command
from models.option import Option
from database import db
from .ssh_manager import ssh_clients
from datetime import datetime

custom_cmd_bp = Blueprint('custom_cmd-bp', __name__)

@custom_cmd_bp.route('/launch-command/<int:machine_id>', methods=['POST'])
def command_fromDb(machine_id):
    if machine_id in ssh_clients:
        data = request.json
        ssh = ssh_clients.get(machine_id)
        
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
                history = History(target=data.get('inputData'),idAdmin=2,idMachine=machine_id, idOption=data.get("selectedSecondOption"), dateHistory = datetime.now())
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
