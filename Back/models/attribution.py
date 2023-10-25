from database import db

class Attribution(db.Model):
    __tablename__ = 'attribution'
    idAttribution = db.Column(db.Integer, primary_key=True)
    idMachine = db.Column(db.Integer, nullable=False)
    idUser = db.Column(db.Integer, nullable=False)
    dateDebut = db.Column(db.DateTime, nullable=True)
    dateFin = db.Column(db.DateTime, nullable=True)

    def __init__(self, idMachine, idUser, dateDebut=None, dateFin=None):
        self.idMachine = idMachine
        self.idUser = idUser
        self.dateDebut = dateDebut
        self.dateFin = dateFin

