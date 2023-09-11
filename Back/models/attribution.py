from database import db

class Attribution(db.Model):
    __tablename__ = 'attribution'
    idAttribution = db.Column(db.Integer, primary_key=True)
    idMachine = db.Column(db.Integer, nullable=False)
    idUser = db.Column(db.Integer, nullable=False)
    dateDebut = db.Column(db.DateTime, nullable=False)
    dateFin = db.Column(db.DateTime, nullable=False)
    def __init__(self, idMachine, idUser, dateDebut, dateFin):
        self.idMachine = idMachine
        self.idUser = idUser
        self.dateDebut = dateDebut
        self.dateFin = dateFin
