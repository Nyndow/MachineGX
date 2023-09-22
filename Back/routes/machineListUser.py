from flask import Blueprint, request,jsonify
from database import db
from models.machine import Machine
from models.OS import OSys
from models.user import User
from models.attribution import Attribution
from datetime import datetime
from .ssh_manager import ssh_clients

machine_user_list = Blueprint('machine_user_list', __name__)

@machine_user_list.route('/machineList', methods=['GET'])
def machineHome():
    try:
        query = db.session.query(
            Machine.machineName,
            OSys.imgOS,
            Machine.idMachine,
            Machine.idOS,
            Machine.ipAddr,
            Machine.portNumber,
            User.userUsername,
            User.userPassword,
            User.numEmployee
        ).join(
            OSys,
            Machine.idOS == OSys.idOS
        ).join(
            Attribution,
            Attribution.idMachine == Machine.idMachine
        ).join(
            User,
            User.idUser == Attribution.idUser
        ).filter(
            Attribution.dateDebut <= datetime.now(),
            datetime.now() <= Attribution.dateFin
        ).all()

        machine_list = []
        for (
            machineName,
            imgOS,
            idMachine,
            idOS,
            ipAddr,
            portNumber,
            userUsername,
            userPassword,
            numEmployee
        ) in query:
            machine_list.append({
                'machineName': machineName,
                'imgOS': imgOS,
                'idMachine': idMachine,
                'idOS': idOS,
                'ipAddr': ipAddr,
                'portNumber': portNumber,
                'userUsername': userUsername,
                'userPassword': userPassword,
                'numEmployee':numEmployee
            })

        return jsonify({'machineHome': machine_list})

    except Exception as e:
        return str(e)


@machine_user_list.route('/transfer-script/<int:machine_id>', methods=['POST'])
def transfer_file(machine_id):
    uploaded_file = request.files['file']
    user_username = request.args.get('userUsername')

    if uploaded_file:
        ssh = ssh_clients.get(machine_id)
        if ssh is None:
            return jsonify({"error": "SSH client not found for machine ID"}), 405

        try:
            sftp = ssh.open_sftp()
            sftp.putfo(uploaded_file, '/home/' + user_username + '/notEmployee/' + uploaded_file.filename)
            sftp.close()

            return jsonify({"message": "File uploaded successfully to SSH server"})
        except Exception as e:
            # Log the error for debugging purposes
            print(f"Error during file transfer: {str(e)}")
            return jsonify({"error": f"Error during file transfer: {str(e)}"}), 500
    else:
        return jsonify({"error": "No file provided"}), 400


#RESSOURCES DETAILS IF IT'S A LINUX SYS
@machine_user_list.route('/execute-script/<int:machine_id>', methods=['GET'])
def execute_script(machine_id):
    try:
        user_username = request.args.get('userUsername')
        ssh = ssh_clients.get(machine_id)
        if ssh is None:
            return jsonify({"error": "SSH client not found for machine ID"}), 405

        script_path = '/home/'+user_username+'/notEmployee/ressources.sh'

        _, stdout, _ = ssh.exec_command(f"/bin/bash {script_path}")
        script_output = stdout.read().decode('utf-8')
        script_data = {}
        for line in script_output.split('\n'):
            parts = line.strip().split(': ')
            if len(parts) == 2:
                key, value = parts
                script_data[key] = value
            elif len(parts) == 1:
                script_data["Unknown"] = parts[0]

        return jsonify({"message": "Script executed successfully on SSH client", "script_data": script_data})

    except Exception as e:
        return jsonify({"error": f"Error during script execution: {str(e)}"}), 500