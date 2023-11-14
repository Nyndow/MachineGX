from flask import Blueprint, request,jsonify
from database import db
from models.machine import Machine
from models.OS import OSys
from models.user import User
from models.attribution import Attribution
from datetime import datetime
from .ssh_manager import ssh_clients
from models.imgOS import ImgOsys
import subprocess
import re

machine_user_list = Blueprint('machine_user_list', __name__)

@machine_user_list.route('/machineList', methods=['GET'])
def machineHome():
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
            Machine.idOS == OSys.idOS
        ).join(
            Attribution,
            Attribution.idMachine == Machine.idMachine
        ).join(
            User,
            User.idUser == Attribution.idUser
        ).join(
            ImgOsys,
            ImgOsys.idImg == OSys.idImg
        ).filter(
            Attribution.dateDebut <= datetime.now(),
            datetime.now() <= Attribution.dateFin
        ).all()

        machine_list = []
        for (
            machineName,
            imgName,
            idMachine,
            idOS,
            userUsername,
            idUser,
            numEmployee
        ) in query:
            machine_list.append({
                'machineName': machineName,
                'imgOS': imgName,
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
    
@machine_user_list.route('/execute-script/<int:user_id>', methods=['GET'])
def execute_script(user_id):
    try:
        user = User.query.get(user_id)
        user_username = user.userUsername
        ssh = ssh_clients.get(user_id)

        if ssh is None:
            return jsonify({"error": "SSH client not found for machine ID"}), 405

        script_path = f'/home/{user_username}/notEmployee/ressources.sh'
        _, stdout,_ = ssh.exec_command(f"/bin/bash {script_path}")
        script_output = stdout.read().decode('utf-8')


        script_data = {}
        for line in script_output.split('\n'):
            parts = line.strip().split(': ')
            if len(parts) == 2:
                key, value = parts
                script_data[key] = value

        return jsonify({"message": "Script executed successfully on SSH client", "script_data": script_data})
    except Exception as e:
        return jsonify({"error": f"Error during script execution: {str(e)}"}), 500





#RESSOURCES DETAILS IF IT'S A LINUX SYS
@machine_user_list.route('/execute-cpu/<int:user_id>', methods=['GET'])
def resource_retrieve(user_id):
    try:
        ssh = ssh_clients.get(user_id)
        if ssh is None:
            return jsonify({"error": "SSH client not found for machine ID"}), 405

        # Command to get CPU usage
        cpu_command = "top -bn1 | grep '%Cpu(s):' | awk '{print $2 +$4 - 15}'"


        # Command to get used memory in MB
        mem_command = "free -m | awk '/^Mem:/ {gsub(/[^0-9]/, \"\", $3); print $3}'"

        # Command to get total memory in GB
        total_mem_command = "free -m | awk 'NR==2 {print $2}'"


        # Execute commands on the remote machine
        _, cpu_output, _ = ssh.exec_command(cpu_command)
        _, used_mem_output, _ = ssh.exec_command(mem_command)
        _, total_mem_output, _ = ssh.exec_command(total_mem_command)

        # Extract and format results
        cpu_usage = float(cpu_output.read())

        used_mem_str = used_mem_output.read().decode()
        used_memory = round(float(re.search(r'\d+', used_mem_str).group()) / 1024, 2) if used_mem_str else 0.0  # Convert MB to GB and round to 3 decimal places

        total_mem_str = total_mem_output.read().decode()
        total_memory = round(float(re.search(r'\d+', total_mem_str).group()) / 1024, 2) if total_mem_str else 0.0  # Convert MB to GB and round to 3 decimal places

        response = {"CPUUsage": cpu_usage, "UsedMemory": used_memory, "TotalMemory": total_memory}

        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)})
    
@machine_user_list.route('/poweroff/<int:user_id>', methods=['POST'])
def poweroff(user_id):
    try:
        ssh = ssh_clients.get(user_id)
        if ssh is None:
            return jsonify({"error": "SSH client not found for machine ID"}), 405

        # Assuming you want to execute the poweroff command
        poweroff_command = "sudo poweroff"
        stdin, stdout, stderr = ssh.exec_command(poweroff_command)

        ssh.close()
        del ssh_clients[user_id]

        # You can check for any errors or get the output if needed
        error_output = stderr.read().decode()
        if error_output:
            return jsonify({"error": f"Error executing poweroff: {error_output}"}), 500

        return jsonify({"message": "Poweroff command executed successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
