# command_bp.py

from flask import Blueprint, request, jsonify
from database import db
from models.command import Command  # Import the Command model

command_bp = Blueprint('command', __name__)

@command_bp.route('/command/', methods=['GET', 'POST'])
def command_list():
    if request.method == 'POST':
        data = request.json
        description = data.get('description')
        cible = data.get('cible')
        new_command = Command(description=description, cible=cible)
        db.session.add(new_command)
        db.session.commit()
        return jsonify({"message": "Command created successfully"})

    elif request.method == 'GET':
        commands = Command.query.all()
        command_list = [{"idCommand": command.idCommand, "description": command.description, "cible": command.cible} for command in commands]
        return jsonify(command_list)

@command_bp.route('/command/<int:command_id>', methods=['GET', 'PUT', 'DELETE'])
def command_detail(command_id):
    command = Command.query.get(command_id)
    if not command:
        return jsonify({"error": "Command not found"}), 404

    if request.method == 'GET':
        command_data = {
            "idCommand": command.idCommand,
            "description": command.description,
            "cible": command.cible
        }
        return jsonify(command_data)

    elif request.method == 'PUT':
        data = request.json
        command.description = data.get('description', command.description)
        command.cible = data.get('cible', command.cible)
        db.session.commit()
        return jsonify({"message": "Command updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(command)
        db.session.commit()
        return jsonify({"message": "Command deleted successfully"})
