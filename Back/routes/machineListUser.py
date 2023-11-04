from flask import Blueprint, request,jsonify
from database import db
from models.machine import Machine
from models.OS import OSys
from models.user import User
from models.attribution import Attribution
from datetime import datetime
from .ssh_manager import ssh_clients
from models.imgOS import ImgOsys

machine_user_list = Blueprint('machine_user_list', __name__)

@machine_user_list.route('/machineList', methods=['GET'])
def machineHome():
    try:
        query = db.session.query(
            Machine.machineName,
            OSys.imgOS,
            Machine.idMachine,
            Machine.idOS,
            User.userUsername,
            User.idUser,
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
            userUsername,
            idUser,
            numEmployee
        ) in query:
            machine_list.append({
                'machineName': machineName,
                'imgOS': imgOS,
                'idMachine': idMachine,
                'idOS': idOS,
                'userUsername': userUsername,
                'idUser': idUser,
                'numEmployee':numEmployee
            })

        return jsonify({'machineHome': machine_list})

    except Exception as e:
        return str(e)
    
@machine_user_list.route('/machineAll', methods=['GET'])
def machineAll():
    try:
        query = db.session.query(
            Machine.machineName,
            ImgOsys.imgName,
            Machine.idMachine,
            Machine.idOS,
            User.userUsername,
            User.idUser,
            User.numEmployee
            ).join(
                OSys,
                OSys.idOS == Machine.idOS
            ).join(
                ImgOsys,
                ImgOsys.idImg == OSys.idImg
            ).join(
                Attribution,
                Attribution.idMachine == Machine.idMachine
            ).join(
                User,
                User.idUser == Attribution.idUser
            ).distinct().all()

        machine_all = []
        for (
            machineName,
            imgName,
            idMachine,
            idOS,
            userUsername,
            idUser,
            numEmployee
        ) in query:
            machine_all.append({
                'machineName': machineName,
                'imgOS': imgName,
                'idMachine': idMachine,
                'idOS': idOS,
                'userUsername': userUsername,
                'idUser': idUser,
                'numEmployee':numEmployee
            })

        return jsonify({'machineAll': machine_all})

    except Exception as e:
        return str(e)


@machine_user_list.route('/transfer-script/<int:user_id>', methods=['POST'])
def transfer_file(user_id):
    if request.files['file']:
        ssh = ssh_clients.get(user_id)
        if ssh is None:
            return jsonify({"error": "SSH client not found for machine ID"}), 405

        try:
            user = User.query.get(user_id)
            sftp = ssh.open_sftp()
            sftp.putfo(request.files['file'], '/home/' + user.userUsername + '/notEmployee/' + request.files['file'].filename)
            sftp.close()

            return jsonify({"message": "File uploaded successfully to SSH server"})
        except Exception as e:
            print(f"Error during file transfer: {str(e)}")
            return jsonify({"error": f"Error during file transfer: {str(e)}"}), 500
    else:
        return jsonify({"error": "No file provided"}), 400


#RESSOURCES DETAILS IF IT'S A LINUX SYS
@machine_user_list.route('/execute-script/<int:user_id>', methods=['GET'])
def execute_script(user_id):
    try:
        user_username = request.args.get('userUsername')
        ssh = ssh_clients.get(user_id)
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