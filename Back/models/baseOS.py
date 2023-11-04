from database import db

class BaseOsys(db.Model):
    __tablename__ = 'baseOsys'
    idBaseOsys = db.Column(db.Integer, primary_key=True)
    nameBase = db.Column(db.String(20), nullable=False)
    idImg = db.Column(db.Integer, nullable=False)

    def __init__(self, nameBase, idImg):
        self.nameBase = nameBase
        self.idImg = idImg