from flask import Blueprint, request, jsonify
from database import db
from models.machine import Machine  

machine_bp = Blueprint('machine', __name__)

@machine_bp.route('/machine/', methods=['GET', 'POST'])
def machine_list():
    if request.method == 'POST':
        data = request.json
        idOS = data.get('idOS')
        machineName = data.get('machineName')
        ram = data.get('ram')
        hdd = data.get('hdd')
        cpu = data.get('cpu')
        ipAddr = data.get('ipAddr')
        portNumber = data.get('portNumber')
        new_machine = Machine(idOS=idOS, machineName=machineName, ram=ram, hdd=hdd, cpu=cpu, ipAddr=ipAddr,portNumber=portNumber)
        db.session.add(new_machine)
        db.session.commit()
        return jsonify({"message": "Machine record created successfully"})

    elif request.method == 'GET':
        machines = Machine.query.all()
        machine_list = [
            {
                "idMachine": machine.idMachine,
                "idOS": machine.idOS,
                "machineName": machine.machineName,
                "ram": machine.ram,
                "hdd": machine.hdd,
                "cpu": machine.cpu,
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
        machine_data = {
            "idMachine": machine.idMachine,
            "idOS": machine.idOS,
            "machineName": machine.machineName,
            "ram": machine.ram,
            "hdd": machine.hdd,
            "cpu": machine.cpu,
            "ipAddr": machine.ipAddr,
            "portNumber": machine.portNumber
        }
        return jsonify(machine_data)

    elif request.method == 'PUT':
        data = request.json
        machine.idOS = data.get('idOS', machine.idOS)
        machine.machineName = data.get('machineName', machine.machineName)
        machine.ram = data.get('ram', machine.ram)
        machine.hdd = data.get('hdd', machine.hdd)
        machine.cpu = data.get('cpu', machine.cpu)
        machine.ipAddr = data.get('ipAddr', machine.ipAddr)
        machine.portNumber = data.get('portNumber', machine.portNumber)
        db.session.commit()
        return jsonify({"message": "Machine record updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(machine)
        db.session.commit()
        return jsonify({"message": "Machine record deleted successfully"})