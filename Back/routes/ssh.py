from flask import Blueprint, request, jsonify
from database import db
from models.machine import Machine  
from models.attribution import Attribution
from models.user import User
from datetime import datetime
import paramiko

ssh_bp = Blueprint('ssh', __name__)

# Define a global SSH client variable
ssh_clients = {}

@ssh_bp.route('/connect/<int:machine_id>', methods=['POST'])
def connect(machine_id):
    try:
        machine = Machine.query.get(machine_id)
        datenow = datetime.now()
        query = (
            db.session.query(User.userUsername, User.userPassword)
            .filter(User.idUser == Attribution.idUser)
            .filter(Attribution.idMachine == machine_id)
            .filter(Attribution.dateDebut <= datenow)
            .filter(datenow <= Attribution.dateFin)
        )
        result = query.first()

        if result:
            userUsername, userPassword = result
        else:
            print("No matching attribution found for the given idMachine and date range.")
            return jsonify({'status': 'Attribution not found'}), 404

        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(hostname=machine.ipAddr, port=machine.portNumber, username=userUsername, password=userPassword)

        # Store the SSH client in the global dictionary
        ssh_clients[machine_id] = ssh_client

        return jsonify({'status': 'up'})
    except paramiko.AuthenticationException:
        return jsonify({'status': 'Authentication failed'}), 401
    except paramiko.SSHException as e:
        return jsonify({'status': 'SSH connection failed', 'error_message': str(e)}), 500
    except Exception as e:
        return jsonify({'status': 'An error occurred', 'error_message': str(e)}), 500

@ssh_bp.route('/disconnect/<int:machine_id>', methods=['POST'])
def disconnect(machine_id):
    try:
        # Get the SSH client from the global dictionary
        ssh_client = ssh_clients.get(machine_id)

        if ssh_client:
            # Close the SSH connection
            ssh_client.close()
            del ssh_clients[machine_id]
            return jsonify({'status': 'down'})
        else:
            return jsonify({'status': 'SSH client not found'}), 404
    except Exception as e:
        return jsonify({'status': 'An error occurred', 'error_message': str(e)}), 500
