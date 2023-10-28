from flask import Blueprint, request, jsonify
from database import db
from models.administration import Administration
from werkzeug.security import generate_password_hash, check_password_hash
import jwt  
from flask import current_app as app 

administration_bp = Blueprint('administration', __name__)

@administration_bp.route('/administration/', methods=['GET', 'POST'])
def administration_list():
    if request.method == 'POST':
        data = request.json
        adminUsername = data.get('adminUsername')
        adminPassword = generate_password_hash(data.get('adminPassword'))
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
                "adminPasswordHashed": True, 
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
            "adminPasswordHashed": True,  
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
    
@administration_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    admin = Administration.query.filter_by(adminUsername=data['username']).first()

    #if not admin or not check_password_hash(admin.adminPassword, data['password']):
    if not admin or admin.adminPassword != data.get('password'):
        return jsonify({'message': 'Invalid username or password'}), 401

    if admin:
        payload = {
            'admin_id': admin.idAdmin
        }
        token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'token': token}), 200
    
@administration_bp.route('/check_admin', methods=['GET'])
def check_admin():
    token = request.headers.get('Authorization').split(' ')[1]
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        admin_id = payload.get('admin_id')
        admin = Administration.query.get(admin_id)
        if admin.isAdmin:
            return jsonify(True)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 501
