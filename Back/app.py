from flask import Flask, request, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import Column, Integer, String  # Import the Column class

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///crud_example.db'
db = SQLAlchemy(app)

# Define Administration model
class Administration(db.Model):
    __tablename__ = 'administration'
    idAdmin = Column(Integer, primary_key=True)
    username = Column(String(200), nullable=False)
    password = Column(String(400))

# Create database tables
with app.app_context():
    db.create_all()

# CRUD operations for Administration
@app.route('/administration/', methods=['GET', 'POST'])
def admin_list():
    if request.method == 'POST':
        data = request.json
        username = data.get('username')
        password = data.get('password')
        admin = Administration(username=username, password=password)
        db.session.add(admin)
        db.session.commit()
        return jsonify({"message": "Admin created successfully"})
    elif request.method == 'GET':
        admins = Administration.query.all()
        admin_list = [{"idAdmin": admin.idAdmin, "username": admin.username, "password": admin.password} for admin in admins]
        return jsonify(admin_list)

@app.route('/administration/<int:admin_id>', methods=['GET', 'PUT', 'DELETE'])
def admin_detail(admin_id):
    admin = Administration.query.get(admin_id)
    if not admin:
        return jsonify({"error": "Admin not found"}), 404

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
        return jsonify({"message": "Admin updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(admin)
        db.session.commit()
        return jsonify({"message": "Admin deleted successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
