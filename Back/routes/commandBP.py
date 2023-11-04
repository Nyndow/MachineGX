# command_bp.py

from flask import Blueprint, request, jsonify
from database import db
from models.command import Command 
from models.OS import OSys
from models.imgOS import ImgOsys
from models.baseOS import BaseOsys

command_bp = Blueprint('command', __name__)

@command_bp.route('/command/', methods=['GET', 'POST'])
def command_list():
    if request.method == 'POST':
        data = request.json
        commandDescription = data.get('commandDescription')
        commandName = data.get('commandName')
        commandComment = data.get('commandComment')
        idBaseOsys = data.get('idBaseOsys')
        new_command = Command(commandDescription=commandDescription, commandName=commandName,commandComment=commandComment,idBaseOsys=idBaseOsys)
        db.session.add(new_command)
        db.session.commit()
        return jsonify({"message": "Command created successfully"})

    elif request.method == 'GET':
        #commands = Command.query.all()
        commands = db.session.query(
            Command.idCommand,
            Command.commandDescription,
            Command.commandName, 
            Command.commandComment,
            ImgOsys.imgName
        ).join(Command ,Command.idBaseOsys == BaseOsys.idBaseOsys
        ).join(BaseOsys,BaseOsys.idImg == ImgOsys.idImg
        ).all()

        command_list = [{"idCommand": command.idCommand, "commandDescription": command.commandDescription,"ImgOsys": command.imgName, "commandName": command.commandName,"commandComment" :command.commandComment} for command in commands]
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
            "idBaseOsys": command.idBaseOsys
        }
        return jsonify(command_data)

    elif request.method == 'PUT':
        data = request.json
        command.commandDescription = data.get('commandDescription', command.commandDescription)
        command.commandName = data.get('commandName', command.commandName)
        command.commandComment= data.get('commandComment', command.commandComment)
        command.idBaseOsys= data.get('idBaseOsys', command.idBaseOsys)
        db.session.commit()
        return jsonify({"message": "Command updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(command)
        db.session.commit()
        return jsonify({"message": "Command deleted successfully"})

@command_bp.route('/commandList/<int:osys_id>', methods=['GET'])
def command_list_os(osys_id):
    osys = OSys.query.filter(OSys.idOS == osys_id).first()
    commands = Command.query.filter(Command.idBaseOsys == osys.baseOS).all()
    command_list = [
        {
            "idCommand": command.idCommand,
            "commandDescription": command.commandDescription,
            "commandName": command.commandName,
            "commandComment": command.commandComment
        }
        for command in commands
        ]
    return jsonify(command_list)


