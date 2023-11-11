from flask import Blueprint, request, jsonify
from database import db
from datetime import datetime
from models.attribution import Attribution  
from models.machine import Machine
from models.user import User

attribution_bp = Blueprint('attribution', __name__)

@attribution_bp.route('/attribution/', methods=['GET', 'POST'])
def attribution_list():
    if request.method == 'POST':
        data = request.json
        machine = Attribution.query.filter(Attribution.idUser == data.get('idUser')).first()
        dateDebut_String = data.get('dateDebut')
        dateDebut = datetime.strptime(dateDebut_String, '%Y-%m-%dT%H:%M:%S.%fZ')  
        dateFin_string = data.get('dateFin')
        dateFin = datetime.strptime(dateFin_string, '%Y-%m-%dT%H:%M:%S.%fZ') 

        new_attribution = Attribution(idMachine=machine.idMachine, idUser=data.get('idUser'), dateDebut=dateDebut, dateFin=dateFin)
        db.session.add(new_attribution)
        db.session.commit()
        return jsonify({"message": "Attribution created successfully"})

    elif request.method == 'GET':
        attributions = db.session.query(
            Attribution.idAttribution,
            Attribution.dateDebut,
            Attribution.dateFin,
            Machine.machineName,
            User.userUsername, 
            User.numEmployee
        ).join(
            User, 
            User.idUser == Attribution.idUser
        ).join(
            Machine,
            Machine.idMachine == Attribution.idMachine
        ).all()
        attribution_list = [
            {
                "idAttribution": attribution.idAttribution,
                "machineName": attribution.machineName,
                "userUsername": attribution.userUsername,
                "numEmployee": attribution.numEmployee,
                "dateDebut": attribution.dateDebut.strftime('%Y-%m-%d %H:%M'),
                "dateFin": attribution.dateFin.strftime('%Y-%m-%d %H:%M')
            }
            for attribution in attributions
            if attribution.dateDebut is not None 
        ]
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
            "idUser": attribution.idUser,
            "dateDebut": attribution.dateDebut.strftime('%Y-%m-%dT%H:%M'),
            "dateFin": attribution.dateFin.strftime('%Y-%m-%dT%H:%M')
        }
        return jsonify(attribution_data)

    elif request.method == 'PUT':
        data = request.json
        dateDebut_string = data.get('dateDebut', attribution.dateDebut)
        attribution.dateDebut = datetime.strptime(dateDebut_string, '%Y-%m-%dT%H:%M')  
        dateFin_string = data.get('dateFin', attribution.dateFin)
        attribution.dateFin = datetime.strptime(dateFin_string, '%Y-%m-%dT%H:%M') 
        db.session.commit()
        return jsonify({"message": "Attribution updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(attribution)
        db.session.commit()
        return jsonify({"message": "Attribution deleted successfully"})
