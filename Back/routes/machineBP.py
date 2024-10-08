from flask import Blueprint, request, jsonify
from database import db
from models.machine import Machine  
from models.OS import OSys

machine_bp = Blueprint('machine', __name__)

@machine_bp.route('/machine/', methods=['GET', 'POST'])
def machine_list():
    if request.method == 'POST':
        data = request.json
        oSys = OSys.query.filter_by(nomOS=data.get('nomOS'), versionOS=data.get('versionOS')).first()
        idOS = oSys.idOS
        new_machine = Machine(idOS=idOS, machineName=data.get('machineName'), ipAddr=data.get('ipAddr'),portNumber=data.get('portNumber'))
        db.session.add(new_machine)
        db.session.commit()
        return jsonify({"link": str(new_machine.idMachine) + "/" + str(idOS)})

    elif request.method == 'GET':
        machines = Machine.query.all()
        machine_list = [
            {
                "idMachine": machine.idMachine,
                "idOS": machine.idOS,
                "machineName": machine.machineName,
                "ipAddr": machine.ipAddr,
                "portNumber": machine.portNumber
            }
            for machine in machines
        ]
        return jsonify(machine_list)

@machine_bp.route('/machine/<int:machine_id>', methods=['GET', 'PUT', 'DELETE'])
def machine_detail(machine_id):
    machine = Machine.query.get(machine_id)
    if not machine:
        return jsonify({"error": "Machine record not found"}), 404

    if request.method == 'GET':
        osys = OSys.query.get(machine.idOS)  
        machine_data = {
            "idMachine": machine.idMachine,
            "nomOS": osys.nomOS,
            "versionOS": osys.versionOS,
            "machineName": machine.machineName,
            "ipAddr": machine.ipAddr,
            "portNumber": machine.portNumber
        }
        return jsonify(machine_data)

    elif request.method == 'PUT':
        data = request.json
        oSys = OSys.query.filter_by(nomOS=data.get('nomOS'), versionOS=data.get('versionOS')).first()
        machine.idOS = oSys.idOS
        machine.machineName = data.get('machineName', machine.machineName)
        machine.ipAddr = data.get('ipAddr', machine.ipAddr)
        machine.portNumber = data.get('portNumber', machine.portNumber)
        db.session.commit()
        return jsonify({"message": "Machine record updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(machine)
        db.session.commit()
        return jsonify({"message": "Machine record deleted successfully"})