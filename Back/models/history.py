from database import db

class History(db.Model):
    __tablename__ = 'history'
    idHistory = db.Column(db.Integer, primary_key=True)
    idMachine = db.Column(db.Integer, nullable=False)
    idAdmin = db.Column(db.Integer, nullable=False)
    idOption = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    
    def __init__(self, idMachine, idAdmin, idOption, date):
        self.idMachine = idMachine
        self.idAdmin = idAdmin
        self.idOption = idOption
        self.date = date

