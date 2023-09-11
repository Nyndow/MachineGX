from database import db

class History(db.Model):
    __tablename__ = 'history'
    idHistory = db.Column(db.Integer, primary_key=True)
    idMachine = db.Column(db.Integer, nullable=False)
    idAdmin = db.Column(db.Integer, nullable=False)
    idOption = db.Column(db.Integer, nullable=False)
    dateHistory = db.Column(db.DateTime, nullable=False)
    
    def __init__(self, idMachine, idAdmin, idOption, dateHistory):
        self.idMachine = idMachine
        self.idAdmin = idAdmin
        self.idOption = idOption
        self.dateHistory = dateHistory

