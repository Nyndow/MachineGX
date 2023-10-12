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
from routes.ssh import ssh_bp
from routes.machineListUser import machine_user_list
from routes.machineUser import machine_user
from routes.topBP import top_bp
from routes.customCommandBP import custom_cmd_bp

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///machineGX.db'
app.config['SECRET_KEY'] = 'your_secret_key'
db.init_app(app)

app.register_blueprint(administration_bp)
app.register_blueprint(attribution_bp)
app.register_blueprint(command_bp)
app.register_blueprint(history_bp)
app.register_blueprint(machine_bp)
app.register_blueprint(option_bp)
app.register_blueprint(user_bp)
app.register_blueprint(oSys_bp)
app.register_blueprint(ssh_bp)
app.register_blueprint(machine_user_list)
app.register_blueprint(machine_user)
app.register_blueprint(top_bp)
app.register_blueprint(custom_cmd_bp)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
