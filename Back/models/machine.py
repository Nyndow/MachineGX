from database import db

class Machine(db.Model):
    __tablename__ = 'machine'
    idMachine = db.Column(db.Integer, primary_key=True)
    os = db.Column(db.String(40), nullable=False)
    hardware = db.Column(db.String(30), nullable=False)
    ram = db.Column(db.Integer, nullable=False)
    hdd = db.Column(db.Integer, nullable=False)
    cpu = db.Column(db.Integer, nullable=False)

    def __init__(self, os, hardware, ram, hdd, cpu):
        self.os = os
        self.hardware = hardware
        self.ram = ram
        self.hdd = hdd
        self.cpu = cpu

