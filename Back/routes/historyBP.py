from flask import Blueprint, request, jsonify
from database import db
from models.history import History 
from models.option import Option
from models.administration import Administration
from models.machine import Machine
from models.OS import OSys
from models.user import User
from models.attribution import Attribution
from models.command import Command
from datetime import datetime
from sqlalchemy import text 
from sqlalchemy import desc

history_bp = Blueprint('history', __name__)

@history_bp.route('/history/<int:history_id>', methods=['GET', 'DELETE'])
def history_detail(history_id):
    history_record = History.query.get(history_id)
    if not history_record:
        return jsonify({"error": "History record not found"}), 404
    
    if request.method == 'GET':
        sql_query = text("""
            SELECT
                a.numEmployee,
                u.numEmployee,
                c.commandDescription,
                u.userUsername,
                os.nomOS,
                os.versionOS
            FROM
                History h
            JOIN
                Administration a ON h.idAdmin = a.idAdmin
            JOIN
                Option o ON h.idOption = o.idOption
            JOIN
                Command c ON o.idCommand = c.idCommand
            JOIN
                Machine m ON h.idMachine = m.idMachine
            JOIN
                OSys os ON m.idOS = os.idOS
            JOIN
                Attribution at ON m.idMachine = at.idMachine
            JOIN
                User u ON at.idUser = u.idUser
            WHERE
                h.dateHistory BETWEEN at.dateDebut AND at.dateFin
                AND h.idHistory = :history_id
        """)

        result = db.session.execute(sql_query, {"history_id": history_id}).fetchone()

        if result:
            result_dict = {
                "admin": result[0],
                "numEmployee": result[1],
                "commandDescription": result[2],
                "userUsername": result[3],
                "nomOS": result[4],
                "versionOS": result[5],
            }
            return jsonify(result_dict)
        else:
            return jsonify({"message": "Record not found"}), 404

    else:
        db.session.delete(history_record)
        db.session.commit()
        return jsonify({"message": "History record deleted successfully"})
    
@history_bp.route('/historyList/', methods=['GET'])
def history_list():
    query = (
        db.session.query(
            Administration.adminUsername,
            Option.optionDescription,
            History.target,
            History.dateHistory,
            Machine.machineName,
            History.idHistory
        )
        .join(Administration, Administration.idAdmin == History.idAdmin)
        .join(Option, Option.idOption == History.idOption)
        .join(Machine, Machine.idMachine == History.idMachine)
        .order_by(desc(History.dateHistory))
    )

    history_records = query.all()

    history_list = [
        {
            "admin": record[0],
            "optionDescription": record[1],
            "target": record[2],
            "dateHistory": record[3].strftime('%Y-%m-%d %H:%M'),
            "machineName": record[4],
            "idHistory" : record[5]
        }
        for record in history_records
    ]

    return jsonify(history_list)
