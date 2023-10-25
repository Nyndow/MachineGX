from flask import Blueprint, request, jsonify
from database import db
from models.user import User
from models.attribution import Attribution 

user_bp = Blueprint('user', __name__)

@user_bp.route('/user/', methods=['POST'])
def create_user():
    if request.method == 'POST':
        data = request.json
        userUsername = data.get('userUsername')
        userPassword = data.get('userPassword')
        numEmployee = data.get('numEmployee')
        new_user = User(userUsername=userUsername, userPassword=userPassword, numEmployee=numEmployee)
        db.session.add(new_user)
        db.session.commit()

        attribution = Attribution(idMachine=data.get('idMachine'), idUser=new_user.idUser)  
        db.session.add(attribution)
        db.session.commit()
        return jsonify({"message": "User created successfully"})


    elif request.method == 'GET':
        users = User.query.all()
        user_list = [
            {
                "idUser": user.idUser,
                "userUsername": user.userUsername,
                "userPassword": user.userPassword,
                "numEmployee": user.numEmployee
            }
            for user in users
        ]
        return jsonify(user_list)

@user_bp.route('/user/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def user_detail(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if request.method == 'GET':
        user_data = {
            "idUser": user.idUser,
            "userUsername": user.userUsername,
            "numEmployee": user.numEmployee
        }
        return jsonify(user_data)

    elif request.method == 'PUT':
        data = request.json
        if not data.get('userUsername'):
            user.userUsername = data.get('userUsername', user.userUsername)
            user.numEmployee = data.get('numEmployee', user.numEmployee)
            db.session.commit()
            return jsonify({"message": "User updated successfully"})
        else:
            user.userPassword = data.get('userPassword', user.userPassword)
            user.userUsername = data.get('userUsername', user.userUsername)
            user.numEmployee = data.get('numEmployee', user.numEmployee)
            db.session.commit()
            return jsonify({"message": "User updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"})
