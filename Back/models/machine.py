from database import db

class Machine(db.Model):
    __tablename__ = 'machine'
    idMachine = db.Column(db.Integer, primary_key=True)
    idOS = db.Column(db.String(10), nullable=True)
    machineName = db.Column(db.String(30), nullable=False)
    ram = db.Column(db.Integer, nullable=False)
    hdd = db.Column(db.Integer, nullable=False)
    cpu = db.Column(db.Integer, nullable=False)
    ipAddr = db.Column(db.String(24), nullable=True)
    portNumber = db.Column(db.Integer, nullable=True)
    

    def __init__(self, idOS, machineName, ram, hdd, cpu,ipAddr, portNumber):
        self.idOS = idOS
        self.machineName = machineName
        self.ram = ram
        self.hdd = hdd
        self.cpu = cpu
        self.ipAddr = ipAddr
        self.portNumber = portNumber

