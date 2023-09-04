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
        hardware = data.get('hardware')
        ram = data.get('ram')
        hdd = data.get('hdd')
        cpu = data.get('cpu')
        new_machine = Machine(os=os, hardware=hardware, ram=ram, hdd=hdd, cpu=cpu)
        db.session.add(new_machine)
        db.session.commit()
        return jsonify({"message": "Machine record created successfully"})

    elif request.method == 'GET':
        machines = Machine.query.all()
        machine_list = [
            {
                "idMachine": machine.idMachine,
                "os": machine.os,
                "hardware": machine.hardware,
                "ram": machine.ram,
                "hdd": machine.hdd,
                "cpu": machine.cpu
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
            "hardware": machine.hardware,
            "ram": machine.ram,
            "hdd": machine.hdd,
            "cpu": machine.cpu
        }
        return jsonify(machine_data)

    elif request.method == 'PUT':
        data = request.json
        machine.os = data.get('os', machine.os)
        machine.hardware = data.get('hardware', machine.hardware)
        machine.ram = data.get('ram', machine.ram)
        machine.hdd = data.get('hdd', machine.hdd)
        machine.cpu = data.get('cpu', machine.cpu)
        db.session.commit()
        return jsonify({"message": "Machine record updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(machine)
        db.session.commit()
        return jsonify({"message": "Machine record deleted successfully"})
