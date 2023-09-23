from flask import Blueprint, request, jsonify
from database import db
from models.machine import Machine 
from models.OS import OSys 
from service.automaID import id_automa

machine_user = Blueprint('machine_user', __name__)

@machine_user.route('/machine_user_add/', methods=['POST'])
def machine_list():
    data = request.json
    machineName = data.get('machineName')
    nomOS = data.get('nomOS')
    versionOS = data.get('versionOS')
    oSys = OSys.query.filter_by(nomOS=nomOS, versionOS=versionOS).first()

    if not oSys:
        idOS = id_automa("idOS", "OSys", "OTH")
        oSys = OSys(idOS=idOS,nomOS=nomOS, versionOS=versionOS, imgOS="unkown.jpg")
        db.session.add(oSys)
        db.session.commit()

    idOS = oSys.idOS
    ipAddr = data.get('ipAddr')
    portNumber = data.get('portNumber')
    new_machine = Machine(idOS=idOS, machineName=machineName, ipAddr=ipAddr, portNumber=portNumber)
    db.session.add(new_machine)
    db.session.commit()

    return jsonify({"message": "Machine record created successfully"})
