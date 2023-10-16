from flask import Blueprint, request, jsonify
import paramiko
from .ssh_manager import ssh_clients

ssh_bp = Blueprint('ssh', __name__)

# SSH CONNECTION
@ssh_bp.route('/connect/<int:machine_id>', methods=['POST'])
def connect(machine_id):
    try:
        if machine_id in ssh_clients:
            return jsonify({'status': 'Already connected'}), 400
        data = request.json
        userUsername = data.get('userUsername')
        userPassword = data.get('userPassword')
        ipAddr = data.get('ipAddr')
        portNumber = data.get('portNumber')
        
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(hostname=ipAddr, port=portNumber, username=userUsername, password=userPassword)

        ssh_clients[machine_id] = ssh_client

        return jsonify({'status': 'up'})
    except paramiko.AuthenticationException:
        return jsonify({'status': 'Authentication failed'}), 401
    except paramiko.SSHException as e:
        return jsonify({'status': 'SSH connection failed', 'error_message': str(e)}), 502
    except Exception as e:
        return jsonify({'status': 'An error occurred', 'error_message': str(e)}), 500

# SSH DECONNECTION
@ssh_bp.route('/disconnect/<int:machine_id>', methods=['POST'])
def disconnect(machine_id):
    try:
        ssh_client = ssh_clients.get(machine_id)

        if ssh_client:
            ssh_client.close()
            del ssh_clients[machine_id]
            return jsonify({'status': 'down'})
        else:
            return jsonify({'status': 'SSH client not found'}), 404
    except Exception as e:
        return jsonify({'status': 'An error occurred', 'error_message': str(e)}), 500