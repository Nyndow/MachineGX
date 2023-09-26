# command_bp.py

from flask import Blueprint, request, jsonify
from database import db
from models.command import Command  # Import the Command model

command_bp = Blueprint('command', __name__)

@command_bp.route('/command/', methods=['GET', 'POST'])
def command_list():
    if request.method == 'POST':
        data = request.json
        commandDescription = data.get('commandDescription')
        commandName = data.get('commandName')
        commandComment = data.get('commandComment')
        baseOS = data.get('baseOS')
        new_command = Command(commandDescription=commandDescription, commandName=commandName,commandComment=commandComment,baseOS=baseOS)
        db.session.add(new_command)
        db.session.commit()
        return jsonify({"message": "Command created successfully"})

    elif request.method == 'GET':
        commands = Command.query.all()
        command_list = [{"idCommand": command.idCommand, "commandDescription": command.commandDescription,"baseOS": command.baseOS, "commandName": command.commandName,"commandComment" :command.commandComment} for command in commands]
        return jsonify(command_list)

@command_bp.route('/command/<int:command_id>', methods=['GET', 'PUT', 'DELETE'])
def command_detail(command_id):
    command = Command.query.get(command_id)
    if not command:
        return jsonify({"error": "Command not found"}), 404

    if request.method == 'GET':
        command_data = {
            "idCommand": command.idCommand,
            "commandDescription": command.commandDescription,
            "commandName": command.commandName,
            "commandComment": command.commandComment,
            "baseOS": command.baseOS
        }
        return jsonify(command_data)

    elif request.method == 'PUT':
        data = request.json
        command.commandDescription = data.get('commandDescription', command.commandDescription)
        command.commandName = data.get('commandName', command.commandName)
        command.commandComment= data.get('commandComment', command.commandComment)
        command.baseOS= data.get('baseOS', command.baseOS)
        db.session.commit()
        return jsonify({"message": "Command updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(command)
        db.session.commit()
        return jsonify({"message": "Command deleted successfully"})

def getLinuxDistroCmd(base_os_prefix):
    commands = Command.query.filter((Command.baseOS.like(f'{base_os_prefix}%'))|(Command.baseOS.like('ALL%'))|(Command.baseOS.like('LINUX%'))).all()
    command_list = [
        {
            "idCommand": command.idCommand,
            "commandDescription": command.commandDescription,
            "baseOS": command.baseOS,
            "commandName": command.commandName,
            "commandComment": command.commandComment
        }
        for command in commands
    ]
    
    return jsonify(command_list)

@command_bp.route('/commandList/<string:osys_id>', methods=['GET'])
def command_list_os(osys_id):
    if osys_id.startswith("WIN"):
        commands = Command.query.filter((Command.baseOS.like('WIN%')) | (Command.baseOS.like('ALL%'))).all()
        command_list = [
            {
                "idCommand": command.idCommand,
                "commandDescription": command.commandDescription,
                "baseOS": command.baseOS,
                "commandName": command.commandName,
                "commandComment": command.commandComment
            }
            for command in commands
        ]
        return jsonify(command_list)
    
    # LINUX
    elif osys_id.startswith("LINUX"):
        commands = Command.query.filter(Command.baseOS.like('LINUX%')).all()
        command_list = [
            {
                "idCommand": command.idCommand,
                "commandDescription": command.commandDescription,
                "baseOS": command.baseOS,
                "commandName": command.commandName,
                "commandComment": command.commandComment
            }
            for command in commands
        ]
        return jsonify(command_list)
    
    # DEBIAN
    elif (osys_id.startswith("DEB")):
        return getLinuxDistroCmd('DEB')
    
    # ARCH
    elif (osys_id.startswith("ARC")):
        return getLinuxDistroCmd("ARC")

    # FEDORA
    elif (osys_id.startswith("FED")):
        return getLinuxDistroCmd("FED")

    # OPENSUSE
    elif (osys_id.startswith("OPE")):
        return getLinuxDistroCmd("OPE")
    
    # OTHER
    elif (osys_id.startswith("OTH")):
        return getLinuxDistroCmd("OTH")
