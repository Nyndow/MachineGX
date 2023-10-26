from flask import Blueprint, request, jsonify
import paramiko
from models.user import User
from models.machine import Machine
from database import db
from .ssh_manager import ssh_clients

ssh_bp = Blueprint('ssh', __name__)

# SSH CONNECTION
@ssh_bp.route('/connect/<int:user_id>', methods=['POST'])
def connect(user_id):
    try:
        if user_id in ssh_clients:
            return jsonify({'status': 'Already connected'}), 400
        user = User.query.get(user_id)
        userUsername= user.userUsername
        userPassword = user.userPassword
        machine = Machine.query.get(request.json.get("idMachine"))
        ipAddr = machine.ipAddr
        portNumber = machine.portNumber
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(hostname=ipAddr, port=portNumber, username=userUsername, password=userPassword)

        ssh_clients[user_id] = ssh_client

        return jsonify({'status': 'up'})
    except paramiko.AuthenticationException:
        return jsonify({'status': 'Authentication failed'}), 401
    except paramiko.SSHException as e:
        return jsonify({'status': 'SSH connection failed', 'error_message': str(e)}), 502
    except Exception as e:
        return jsonify({'status': 'An error occurred', 'error_message': str(e)}), 500

# SSH DECONNECTION
@ssh_bp.route('/disconnect/<int:user_id>', methods=['POST'])
def disconnect(user_id):
    try:
        ssh_client = ssh_clients.get(user_id)

        if ssh_client:
            ssh_client.close()
            del ssh_clients[user_id]
            return jsonify({'status': 'down'})
        else:
            return jsonify({'status': 'SSH client not found'}), 404
    except Exception as e:
        return jsonify({'status': 'An error occurred', 'error_message': str(e)}), 500
