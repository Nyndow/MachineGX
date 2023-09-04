# history_bp.py

from flask import Blueprint, request, jsonify
from database import db
from models.history import History  # Import the History model

history_bp = Blueprint('history', __name__)

@history_bp.route('/history/', methods=['GET', 'POST'])
def history_list():
    if request.method == 'POST':
        data = request.json
        idMachine = data.get('idMachine')
        idAdmin = data.get('idAdmin')
        idOption = data.get('idOption')
        date = data.get('date')
        new_history = History(idMachine=idMachine, idAdmin=idAdmin, idOption=idOption, date=date)
        db.session.add(new_history)
        db.session.commit()
        return jsonify({"message": "History record created successfully"})

    elif request.method == 'GET':
        history_records = History.query.all()
        history_list = [
            {
                "idHistory": record.idHistory,
                "idMachine": record.idMachine,
                "idAdmin": record.idAdmin,
                "idOption": record.idOption,
                "date": record.date.strftime('%Y-%m-%d')
            }
            for record in history_records
        ]
        return jsonify(history_list)

@history_bp.route('/history/<int:history_id>', methods=['GET', 'PUT', 'DELETE'])
def history_detail(history_id):
    history_record = History.query.get(history_id)
    if not history_record:
        return jsonify({"error": "History record not found"}), 404

    if request.method == 'GET':
        history_data = {
            "idHistory": history_record.idHistory,
            "idMachine": history_record.idMachine,
            "idAdmin": history_record.idAdmin,
            "idOption": history_record.idOption,
            "date": history_record.date.strftime('%Y-%m-%d')
        }
        return jsonify(history_data)

    elif request.method == 'PUT':
        data = request.json
        history_record.idMachine = data.get('idMachine', history_record.idMachine)
        history_record.idAdmin = data.get('idAdmin', history_record.idAdmin)
        history_record.idOption = data.get('idOption', history_record.idOption)
        history_record.date = data.get('date', history_record.date)
        db.session.commit()
        return jsonify({"message": "History record updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(history_record)
        db.session.commit()
        return jsonify({"message": "History record deleted successfully"})
