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
        # Perform a join between relevant tables to fetch machine and user data in one query
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

    if uploaded_file:
        ssh = ssh_clients.get(machine_id)
        if ssh is None:
            return jsonify({"error": "SSH client not found for machine ID"}), 405

        try:
            sftp = ssh.open_sftp()
            sftp.put(uploaded_file.filename, '/home/debian/notEmployee/' + uploaded_file.filename)
            sftp.close()

            return jsonify({"message": "File uploaded successfully to SSH server"})
        except Exception as e:
            return jsonify({"error": f"Error during file transfer: {str(e)}"}), 500
    else:
        return jsonify({"error": "No file provided"}), 400