from flask import Blueprint, request, jsonify
from database import db
from models.baseOS import BaseOsys
from models.imgOS import ImgOsys
baseOsys_bp = Blueprint('baseOsys', __name__)

@baseOsys_bp.route('/baseOsys/', methods=['GET', 'POST'])
def base_oSys_list():
    if request.method == 'POST':
        data = request.json
        nameBase = data.get('nameBase')
        print('NAME :',nameBase)
        img = ImgOsys.query.filter_by(imgName=data.get('imgOs')).first()
        if img:
            idImg = img.idImg
        else:
            newImg = ImgOsys(imgName=data.get('imgOs'))
            db.session.add(newImg)
            db.session.commit()
            idImg = newImg.idImg

        newBase = BaseOsys(nameBase=nameBase, idImg=idImg)
        db.session.add(newBase)
        db.session.commit()

        return jsonify({"message": "Base Operating System created successfully"})

    elif request.method == 'GET':
        oSysS = db.session.query(
            BaseOsys.idBaseOsys, 
            BaseOsys.nameBase,
            ImgOsys.imgName
        ).join(BaseOsys, BaseOsys.idImg== ImgOsys.idImg
        ).all(
        )

        oSys_list = [
            {
                "idBaseOsys": oSys.idBaseOsys,
                "nameBase": oSys.nameBase,
                "imgBase": oSys.imgName
            }
            for oSys in oSysS
        ]
        return jsonify(oSys_list)

@baseOsys_bp.route('/baseOsys/<int:oSys_id>', methods=['GET', 'PUT', 'DELETE'])
def base_oSys_detail(oSys_id):
    oSys = db.session.query(BaseOsys).filter(BaseOsys.idBaseOsys == oSys_id).first()
    if not oSys:
        return jsonify({"error": "oSys not found"}), 404

    if request.method == 'GET':
        oSys = db.session.query(
        BaseOsys.nameBase,
        ImgOsys.imgName
        ).join(BaseOsys, BaseOsys.idImg == ImgOsys.idImg).filter(BaseOsys.idBaseOsys == oSys_id).first()
        oSys_data = {
            "nameBase": oSys.nameBase,
            "imgOs": oSys.imgName  
        }
        return jsonify(oSys_data)

    elif request.method == 'PUT':
        data = request.json

        try:
            oSys.nameBase = data.get('nameBase', oSys.nameBase)
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
            return jsonify({"message": "Base Operating System updated successfully"})

        except Exception as e:
            db.session.rollback()
            print(data.get('imgOs'))
            return jsonify({"error": "An error occurred while updating Base Operating System"}), 500


    elif request.method == 'DELETE':
        db.session.delete(oSys)
        db.session.commit()
        return jsonify({"message": "Base Operating System deleted successfully"})
    
