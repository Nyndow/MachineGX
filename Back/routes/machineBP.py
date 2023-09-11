# machine_bp.py

from flask import Blueprint, request, jsonify
from database import db
from models.machine import Machine  # Import the Machine model

machine_bp = Blueprint('machine', __name__)

@machine_bp.route('/machine/', methods=['GET', 'POST'])
def machine_list():
    if request.method == 'POST':
        data = request.json
        os = data.get('os')
        machineName = data.get('machineName')
        ram = data.get('ram')
        hdd = data.get('hdd')
        cpu = data.get('cpu')
        ipAddr = data.get('ipAddr')
        new_machine = Machine(os=os, machineName=machineName, ram=ram, hdd=hdd, cpu=cpu, ipAddr=ipAddr)
        db.session.add(new_machine)
        db.session.commit()
        return jsonify({"message": "Machine record created successfully"})

    elif request.method == 'GET':
        machines = Machine.query.all()
        machine_list = [
            {
                "idMachine": machine.idMachine,
                "os": machine.os,
                "machineName": machine.machineName,
                "ram": machine.ram,
                "hdd": machine.hdd,
                "cpu": machine.cpu,
                "ipAddr": machine.ipAddr
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
            "os": machine.os,
            "machineName": machine.machineName,
            "ram": machine.ram,
            "hdd": machine.hdd,
            "cpu": machine.cpu,
            "ipAddr": machine.ipAddr
        }
        return jsonify(machine_data)

    elif request.method == 'PUT':
        data = request.json
        machine.os = data.get('os', machine.os)
        machine.machineName = data.get('machineName', machine.machineName)
        machine.ram = data.get('ram', machine.ram)
        machine.hdd = data.get('hdd', machine.hdd)
        machine.cpu = data.get('cpu', machine.cpu)
        machine.ipAddr = data.get('ipAddr', machine.ipAddr)
        db.session.commit()
        return jsonify({"message": "Machine record updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(machine)
        db.session.commit()
        return jsonify({"message": "Machine record deleted successfully"})
