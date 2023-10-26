from flask import Blueprint, request, jsonify
from database import db
from models.machine import Machine 
from models.user import User 
from models.OS import OSys 
from .ssh_manager import ssh_clients
from models.attribution import Attribution

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

@machine_user.route('/machine_user/<int:machine_id>', methods=['GET'])
def get_machine_user(machine_id):
    try:
        query = (
            db.session.query(User.userUsername, User.idUser)
            .join(Attribution, Attribution.idUser == User.idUser)
            .filter(Attribution.idMachine == machine_id)
            .distinct()
        )
        results = query.all()
        user_data = [{"userUsername": user[0], "idUser": user[1]} for user in results]

        return jsonify(user_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@machine_user.route('/machine_userList/<int:machine_id>', methods=['GET'])
def users_machine(machine_id):
    try:
        query = (
            db.session.query(User.userUsername, User.idUser, User.numEmployee)
            .join(Attribution, Attribution.idUser == User.idUser)
            .filter(Attribution.idMachine == machine_id)
            .distinct()
        )
        results = query.all()
        user_data = [{"userUsername": user[0], "idUser": user[1], "numEmployee": user[2]} for user in results]

        return jsonify(user_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#VERIFY CONNEXION FOR CARDPAGE FROM CARDLIST
@machine_user.route('/verify_conn/<int:user_id>', methods=['GET'])
def verify_conn(user_id):
    return jsonify(success=user_id in ssh_clients)
