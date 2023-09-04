# users_bp.py

from flask import Blueprint, request, jsonify
from database import db
from models.user import User  # Import the User model

user_bp = Blueprint('user', __name__)

# users_bp.py (continued)

@user_bp.route('/user/', methods=['GET', 'POST'])
def user_list():
    if request.method == 'POST':
        data = request.json
        username = data.get('username')
        password = data.get('password')
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully"})

    elif request.method == 'GET':
        users = User.query.all()
        user_list = [{"idUser": user.idUser, "username": user.username, "password": user.password} for user in users]
        return jsonify(user_list)

@user_bp.route('/user/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def user_detail(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if request.method == 'GET':
        user_data = {
            "idUser": user.idUser,
            "username": user.username,
            "password": user.password
        }
        return jsonify(user_data)

    elif request.method == 'PUT':
        data = request.json
        user.username = data.get('username', user.username)
        user.password = data.get('password', user.password)
        db.session.commit()
        return jsonify({"message": "User updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"})
