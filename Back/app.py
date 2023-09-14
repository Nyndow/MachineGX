from flask import Flask
from flask_cors import CORS
from database import db
from routes.administrationBP import administration_bp
from routes.attributionBP import attribution_bp
from routes.commandBP import command_bp
from routes.historyBP import history_bp
from routes.machineBP import machine_bp
from routes.optionBP import option_bp
from routes.userBP import user_bp
from routes.osBP import oSys_bp

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///machineGX.db'
db.init_app(app)

# Register Blueprints
app.register_blueprint(administration_bp)
app.register_blueprint(attribution_bp)
app.register_blueprint(command_bp)
app.register_blueprint(history_bp)
app.register_blueprint(machine_bp)
app.register_blueprint(option_bp)
app.register_blueprint(user_bp)
app.register_blueprint(oSys_bp)

# Initialize the database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
