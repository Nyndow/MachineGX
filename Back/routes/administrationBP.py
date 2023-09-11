# administration_bp.py

from flask import Blueprint, request, jsonify
from database import db
from models.administration import Administration
from werkzeug.security import generate_password_hash, check_password_hash

administration_bp = Blueprint('administration', __name__)

@administration_bp.route('/administration/', methods=['GET', 'POST'])
def administration_list():
    if request.method == 'POST':
        data = request.json
        adminUsername = data.get('adminUsername')
        adminPassword = generate_password_hash(data.get('adminPassword'))  # Hash the password
        numEmployee = data.get('numEmployee')
        new_administration = Administration(adminUsername=adminUsername, adminPassword=adminPassword, numEmployee=numEmployee) 
        db.session.add(new_administration)
        db.session.commit()
        return jsonify({"message": "Administration created successfully"})

    elif request.method == 'GET':
        administrators = Administration.query.all() 
        admin_list = [
            {
                "idAdmin": admin.idAdmin,
                "adminUsername": admin.adminUsername,
                "adminPasswordHashed": True,  # Indicate that the password is hashed
                "numEmployee": admin.numEmployee
            }
            for admin in administrators
        ]
        return jsonify(admin_list)

@administration_bp.route('/administration/<int:admin_id>', methods=['GET', 'PUT', 'DELETE'])
def administration_detail(admin_id):
    admin = Administration.query.get(admin_id)  
    if not admin:
        return jsonify({"error": "Administration not found"}), 404

    if request.method == 'GET':
        admin_data = {
            "idAdmin": admin.idAdmin, 
            "adminUsername": admin.adminUsername,
            "adminPasswordHashed": True,  # Indicate that the password is hashed
            "numEmployee": admin.numEmployee
        }
        return jsonify(admin_data)

    elif request.method == 'PUT':
        data = request.json
        admin.adminUsername = data.get('adminUsername', admin.adminUsername)
        if 'adminPassword' in data:
            adminPassword = generate_password_hash(data.get('adminPassword'))  # Update and hash the password
            admin.adminPassword = adminPassword
        admin.numEmployee = data.get('numEmployee', admin.numEmployee)
        db.session.commit()
        return jsonify({"message": "Administration updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(admin)
        db.session.commit()
        return jsonify({"message": "Administration deleted successfully"})
