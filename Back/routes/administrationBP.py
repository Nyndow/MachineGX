# administration_bp.py

from flask import Blueprint, request, jsonify
from database import db
from models.administration import Administration  # Corrected import

administration_bp = Blueprint('administration', __name__)

@administration_bp.route('/administration/', methods=['GET', 'POST'])
def administration_list():
    if request.method == 'POST':
        data = request.json
        username = data.get('username')
        password = data.get('password')
        new_administration = Administration(username=username, password=password) 
        db.session.add(new_administration)
        db.session.commit()
        return jsonify({"message": "Administration created successfully"})

    elif request.method == 'GET':
        administrators = Administration.query.all() 
        admin_list = [{"idAdmin": admin.idAdmin, "username": admin.username, "password": admin.password} for admin in administrators]  
        return jsonify(admin_list)

@administration_bp.route('/administration/<int:admin_id>', methods=['GET', 'PUT', 'DELETE'])
def administration_detail(admin_id):
    admin = Administration.query.get(admin_id)  
    if not admin:
        return jsonify({"error": "Administration not found"}), 404

    if request.method == 'GET':
        admin_data = {
            "idAdmin": admin.idAdmin, 
            "username": admin.username,
            "password": admin.password
        }
        return jsonify(admin_data)

    elif request.method == 'PUT':
        data = request.json
        admin.username = data.get('username', admin.username)
        admin.password = data.get('password', admin.password)
        db.session.commit()
        return jsonify({"message": "Administration updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(admin)
        db.session.commit()
        return jsonify({"message": "Administration deleted successfully"})
