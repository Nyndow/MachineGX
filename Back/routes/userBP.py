# users_bp.py

from flask import Blueprint, request, jsonify
from database import db
from models.user import User  # Import the User model
from werkzeug.security import generate_password_hash, check_password_hash

user_bp = Blueprint('user', __name__)

@user_bp.route('/user/', methods=['GET', 'POST'])
def user_list():
    if request.method == 'POST':
        data = request.json
        userUsername = data.get('userUsername')
        userPassword = generate_password_hash(data.get('userPassword'))  # Hash the password
        numEmployee = data.get('numEmployee')
        new_user = User(userUsername=userUsername, userPassword=userPassword, numEmployee=numEmployee)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully"})

    elif request.method == 'GET':
        users = User.query.all()
        user_list = [
            {
                "idUser": user.idUser,
                "userUsername": user.userUsername,
                "userPasswordHashed": True,  # Indicate that the password is hashed
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
            "userPasswordHashed": True,  # Indicate that the password is hashed
            "numEmployee": user.numEmployee
        }
        return jsonify(user_data)

    elif request.method == 'PUT':
        data = request.json
        user.userUsername = data.get('userUsername', user.userUsername)
        if 'userPassword' in data:
            userPassword = generate_password_hash(data.get('userPassword'))  # Update and hash the password
            user.userPassword = userPassword
        user.numEmployee = data.get('numEmployee', user.numEmployee)
        db.session.commit()
        return jsonify({"message": "User updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"})
