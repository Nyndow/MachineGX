# attribution_bp.py

from flask import Blueprint, request, jsonify
from database import db
from models.attribution import Attribution  # Import the Attribution model

attribution_bp = Blueprint('attribution', __name__)

# attribution_bp.py (continued)

@attribution_bp.route('/attribution/', methods=['GET', 'POST'])
def attribution_list():
    if request.method == 'POST':
        data = request.json
        idMachine = data.get('idMachine')
        idUser = data.get('idUser')
        new_attribution = Attribution(idMachine=idMachine, idUser=idUser)
        db.session.add(new_attribution)
        db.session.commit()
        return jsonify({"message": "Attribution created successfully"})

    elif request.method == 'GET':
        attributions = Attribution.query.all()
        attribution_list = [{"idAttribution": attribution.idAttribution, "idMachine": attribution.idMachine, "idUser": attribution.idUser} for attribution in attributions]
        return jsonify(attribution_list)

@attribution_bp.route('/attribution/<int:attribution_id>', methods=['GET', 'PUT', 'DELETE'])
def attribution_detail(attribution_id):
    attribution = Attribution.query.get(attribution_id)
    if not attribution:
        return jsonify({"error": "Attribution not found"}), 404

    if request.method == 'GET':
        attribution_data = {
            "idAttribution": attribution.idAttribution,
            "idMachine": attribution.idMachine,
            "idUser": attribution.idUser
        }
        return jsonify(attribution_data)

    elif request.method == 'PUT':
        data = request.json
        attribution.idMachine = data.get('idMachine', attribution.idMachine)
        attribution.idUser = data.get('idUser', attribution.idUser)
        db.session.commit()
        return jsonify({"message": "Attribution updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(attribution)
        db.session.commit()
        return jsonify({"message": "Attribution deleted successfully"})
