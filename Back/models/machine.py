from database import db

class Machine(db.Model):
    __tablename__ = 'machine'
    idMachine = db.Column(db.Integer, primary_key=True)
    os = db.Column(db.String(40), nullable=True)
    machineName = db.Column(db.String(30), nullable=False)
    ram = db.Column(db.Integer, nullable=False)
    hdd = db.Column(db.Integer, nullable=False)
    cpu = db.Column(db.Integer, nullable=False)
    ipAddr = db.Column(db.String(32), nullable=True)
    

    def __init__(self, os, machineName, ram, hdd, cpu,ipAddr):
        self.os = os
        self.machineName = machineName
        self.ram = ram
        self.hdd = hdd
        self.cpu = cpu
        self.ipAddr = ipAddr

