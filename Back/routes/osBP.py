# oSys_bp.py

from flask import Blueprint, request, jsonify
from database import db
from models.OS import OSys
oSys_bp = Blueprint('oSys', __name__)

@oSys_bp.route('/oSys/', methods=['GET', 'POST'])
def oSys_list():
    if request.method == 'POST':
        data = request.json
        nomOS = data.get('nomOS')
        versionOS = data.get('versionOS')
        imgOS = data.get('imgOS')
        new_oSys = OSys(nomOS=nomOS, versionOS=versionOS, imgOS=imgOS) 
        db.session.add(new_oSys)
        db.session.commit()
        return jsonify({"message": "oSys created successfully"})

    elif request.method == 'GET':
        oSysS = OSys.query.all() 
        oSys_list = [
            {
                "idOS": oSys.idOS,
                "nomOS": oSys.nomOS,
                "versionOS":oSys.versionOS, 
                "imgOS": oSys.imgOS
            }
            for oSys in oSysS
        ]
        return jsonify(oSys_list)

@oSys_bp.route('/oSys/<int:oSys_id>', methods=['GET', 'PUT', 'DELETE'])
def oSys_detail(oSys_id):
    oSys = OSys.query.get(oSys_id)  
    if not oSys:
        return jsonify({"error": "oSys not found"}), 404

    if request.method == 'GET':
        oSys_data = {
            "idOS": oSys.idOS, 
            "nomOS": oSys.nomOS,
            "versionOS":oSys.versionOS, 
            "imgOS": oSys.imgOS
        }
        return jsonify(oSys_data)

    elif request.method == 'PUT':
        data = request.json
        oSys.nomOS = data.get('nomOS', oSys.nomOS)
        oSys.versionOS = data.get('versionOS', oSys.versionOS)
        oSys.imgOS = data.get('imgOS', oSys.imgOS)
        db.session.commit()
        return jsonify({"message": "oSys updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(oSys)
        db.session.commit()
        return jsonify({"message": "oSys deleted successfully"})
