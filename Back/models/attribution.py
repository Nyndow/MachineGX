from database import db

class Attribution(db.Model):
    __tablename__ = 'attribution'
    idAttribution = db.Column(db.Integer, primary_key=True)
    idMachine = db.Column(db.Integer, nullable=False)
    idUser = db.Column(db.Integer, nullable=False)
    def __init__(self, idMachine, idUser):
        self.idMachine = idMachine
        self.idUser = idUser
