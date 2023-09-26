from flask import Blueprint, jsonify
import paramiko
from models.top import TopProcess 
from .ssh_manager import ssh_clients

top_bp = Blueprint('top', __name__)

@top_bp.route('/top/<int:machine_id>', methods=['GET'])
def sorted_top_output(machine_id):
    if machine_id in ssh_clients:
        ssh = ssh_clients.get(machine_id)

        top_command = "top -b -n 1 | awk 'NR > 0 && NR <= 12 {print $1, $2, $9, $10, $12}'"

        try:
            stdin, stdout, stderr = ssh.exec_command(top_command)
            output = stdout.read().decode()
            top_processes = []
            for line in output.splitlines():
                fields = line.strip().split()
                if len(fields) == 5:
                    pid, user, cpu, ram, command = fields
                    top_process = TopProcess(pid, user, cpu, ram, command)
                    top_processes.append(top_process)

            top_processes_json = [
                {
                    "PID": process.pid,
                    "User": process.user,
                    "CPU Usage": process.cpu,
                    "Memory Usage": process.ram,
                    "Program": process.command
                }
                for process in top_processes
            ]

            return jsonify(top_processes_json)

        except paramiko.SSHException as e:
            return jsonify({"error": str(e)}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    else:
        return jsonify({"error": "Machine not found"}), 404
    
@top_bp.route('/top/<int:machine_id>/<string:PID>', methods=['POST'])
def kill_process(machine_id, PID):
    if machine_id in ssh_clients:
        ssh = ssh_clients.get(machine_id)

        kill_command = f'kill -9 {PID}'

        try:
            stdin, stdout, stderr = ssh.exec_command(kill_command)
            error_output = stderr.read().decode().strip()
            if error_output:
                return jsonify({"error": error_output}), 500

            return jsonify({"message": f"Process with PID {PID} killed successfully"})

        except paramiko.SSHException as e:
            return jsonify({"error": str(e)}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Machine not found"}), 404
