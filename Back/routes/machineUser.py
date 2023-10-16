from flask import Blueprint, request, jsonify
from database import db
from models.machine import Machine 
from models.user import User 
from models.OS import OSys 
from service.automaID import id_automa

machine_user = Blueprint('machine_user', __name__)

@machine_user.route('/machine_user_add/', methods=['POST'])
def machine_list():
    data = request.json

    if len(data.get('userUsername')) > 0:
        machineName = data.get('machineName')
        nomOS = data.get('nomOS')
        versionOS = data.get('versionOS')
        oSys = OSys.query.filter_by(nomOS=nomOS, versionOS=versionOS).first()
        idOS = oSys.idOS
        ipAddr = data.get('ipAddr')
        portNumber = data.get('portNumber')

        new_user = User(numEmployee=data.get('numEMP'), userPassword=data.get('userPassword'), userUsername=data.get('userUsername') )
        new_machine = Machine(idOS=idOS, machineName=machineName, ipAddr=ipAddr, portNumber=portNumber)
        db.session.add(new_machine)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"link": str(new_machine.idMachine) + "/" + str(idOS)})
    else:
        machineName = data.get('machineName')
        nomOS = data.get('nomOS')
        versionOS = data.get('versionOS')
        oSys = OSys.query.filter_by(nomOS=nomOS, versionOS=versionOS).first()
        idOS = oSys.idOS
        ipAddr = data.get('ipAddr')
        portNumber = data.get('portNumber')
        new_machine = Machine(idOS=idOS, machineName=machineName, ipAddr=ipAddr, portNumber=portNumber)
        db.session.add(new_machine)
        db.session.commit()

        return jsonify({"link": str(new_machine.idMachine) + "/" + str(idOS)})


