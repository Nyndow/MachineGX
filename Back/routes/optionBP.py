from flask import Blueprint, request, jsonify
from database import db
from models.option import Option 
option_bp = Blueprint('option', __name__)

@option_bp.route('/option/', methods=['GET', 'POST'])
def option_list():
    if request.method == 'POST':
        data = request.json
        idCommand = data.get('idCommand')
        optionDescription = data.get('optionDescription')
        optionSyntax = data.get('optionSyntax')
        optionComment = data.get('optionComment')
        target = data.get('target')
        new_option = Option(idCommand=idCommand, optionDescription=optionDescription, optionSyntax=optionSyntax,optionComment=optionComment,target=target)
        db.session.add(new_option)
        db.session.commit()
        return jsonify({"message": "Option created successfully"})

    elif request.method == 'GET':
        options = Option.query.all()
        option_list = [{"idOption": option.idOption, "idCommand": option.idCommand, "optionSyntax": option.optionSyntax,"optionDescription": option.optionDescription,"optionComment": option.optionComment,"target": option.target} for option in options]
        return jsonify(option_list)

@option_bp.route('/option/<int:option_id>', methods=['GET', 'PUT', 'DELETE'])
def option_detail(option_id):
    option = Option.query.get(option_id)
    if not option:
        return jsonify({"error": "Option not found"}), 404

    if request.method == 'GET':
        option_data = {
            "idOption": option.idOption,
            "idCommand": option.idCommand,
            "optionDescription": option.optionDescription,
            "optionSyntax": option.optionSyntax,
            "optionComment": option.optionComment,
            "target": option.target
        }
        return jsonify(option_data)

    elif request.method == 'PUT':
        data = request.json
        option.optionDescription = data.get('optionDescription', option.optionDescription)
        option.optionSyntax = data.get('optionSyntax', option.optionSyntax)
        option.optionComment = data.get('optionComment', option.optionComment)
        option.idCommand = data.get('idCommand', option.idCommand)
        option.target = data.get('target', option.target)
        db.session.commit()
        return jsonify({"message": "Option updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(option)
        db.session.commit()
        return jsonify({"message": "Option deleted successfully"})
    
@option_bp.route('/optionByCmd/<int:command_id>', methods=['GET'])
def option_basedCommand(command_id):
    options = Option.query.filter_by(idCommand=command_id).all()
    if not options:
        return jsonify({"error": "Option not found"}), 404

    option_data = [{
        "idOption": option.idOption,
        "idCommand": option.idCommand,
        "optionDescription": option.optionDescription,
        "optionSyntax": option.optionSyntax,
        "optionComment": option.optionComment,
        "target": option.target
        }for option in options]
    return jsonify(option_data)