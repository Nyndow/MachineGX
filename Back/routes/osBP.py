from flask import Blueprint, request, jsonify
from database import db
from models.OS import OSys
from models.imgOS import ImgOsys
oSys_bp = Blueprint('oSys', __name__)

@oSys_bp.route('/oSys/', methods=['GET', 'POST'])
def oSys_list():
    if request.method == 'POST':
        data = request.json
        nomOS = data.get('nomOS')
        versionOS = data.get('versionOS')
        baseOS = data.get('baseOS')

        existing_oSys = OSys.query.filter_by(nomOS=nomOS, versionOS=versionOS).first()

        if existing_oSys:
            db.session.delete(existing_oSys)
            db.session.commit()
        img = ImgOsys.query.filter_by(imgName=data.get('imgOs')).first()
        if img:
            idImg = img.idImg
        else:
            newImg = ImgOsys(imgName=data.get('imgOs'))
            db.session.add(newImg)
            db.session.commit()
            idImg = newImg.idImg


        new_oSys = OSys(nomOS=nomOS, versionOS=versionOS,baseOS=baseOS, idImg=idImg)

        db.session.add(new_oSys)
        db.session.commit()

        return jsonify({"message": "oSys created successfully"})

    elif request.method == 'GET':
        oSysS = db.session.query(
            OSys.idOS, 
            OSys.nomOS,
            OSys.versionOS,
            ImgOsys.imgName
        ).join(OSys, OSys.idImg== ImgOsys.idImg
        ).all(
        )
        oSys_list = [
            {
                "idOS": oSys.idOS,
                "nomOS": oSys.nomOS,
                "versionOS": oSys.versionOS,
                "imgOs": oSys.imgName
            }
            for oSys in oSysS
        ]
        return jsonify(oSys_list)

@oSys_bp.route('/oSys/<int:oSys_id>', methods=['GET', 'PUT', 'DELETE'])
def oSys_detail(oSys_id):
    oSys = db.session.query(OSys).filter(OSys.idOS == oSys_id).first()
    if not oSys:
        return jsonify({"error": "oSys not found"}), 404

    if request.method == 'GET':
        oSys = db.session.query(
        OSys.nomOS,
        OSys.versionOS,
        ImgOsys.imgName
        ).join(OSys, OSys.idImg== ImgOsys.idImg
        ).filter(OSys.idOS == oSys_id).first()
        oSys_data = {
            "nomOS": oSys.nomOS,
            "versionOS":oSys.versionOS, 
            "imgOs": oSys.imgName
        }
        return jsonify(oSys_data)

    elif request.method == 'PUT':
        data = request.json

        if not oSys:
            return jsonify({"error": "oSys not found"}), 404

        try:
            oSys.nomOS = data.get('nomOS', oSys.nomOS)
            oSys.versionOS = data.get('versionOS', oSys.versionOS)

            img = ImgOsys.query.filter_by(imgName=data.get('imgOs')).first()
            if img:
                idImg = img.idImg
            else:
                newImg = ImgOsys(imgName=data.get('imgOs'))
                db.session.add(newImg)
                db.session.flush()
                idImg = newImg.idImg

            oSys.idImg = idImg

            db.session.commit()
            return jsonify({"message": "oSys updated successfully"})

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "An error occurred while updating oSys"}), 500

    elif request.method == 'DELETE':
        db.session.delete(oSys)
        db.session.commit()
        return jsonify({"message": "oSys deleted successfully"})
    
    
