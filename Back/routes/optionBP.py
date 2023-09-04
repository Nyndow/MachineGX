from flask import Blueprint, request, jsonify
from database import db
from models.option import Option  # Import the Option class from your models file

option_bp = Blueprint('option', __name__)

@option_bp.route('/option/', methods=['GET', 'POST'])
def option_list():
    if request.method == 'POST':
        data = request.json
        idCommand = data.get('idCommand')
        description = data.get('description')
        new_option = Option(idCommand=idCommand, description=description)
        db.session.add(new_option)
        db.session.commit()
        return jsonify({"message": "Option created successfully"})

    elif request.method == 'GET':
        options = Option.query.all()
        option_list = [{"idOption": option.idOption, "idCommand": option.idCommand, "description": option.description} for option in options]
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
            "description": option.description
        }
        return jsonify(option_data)

    elif request.method == 'PUT':
        data = request.json
        option.idCommand = data.get('idCommand', option.idCommand)
        option.description = data.get('description', option.description)
        db.session.commit()
        return jsonify({"message": "Option updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(option)
        db.session.commit()
        return jsonify({"message": "Option deleted successfully"})