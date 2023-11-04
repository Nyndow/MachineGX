from database import db

class OSys(db.Model):
    __tablename__ = 'oSys'
    idOS = db.Column(db.Integer, primary_key=True)
    nomOS = db.Column(db.String(20), nullable=False)
    versionOS = db.Column(db.Integer, nullable=True)
    idImg = db.Column(db.Integer, nullable=False)
    baseOS = db.Column(db.Integer,nullable=False)

    def __init__(self, nomOS, versionOS, idImg, baseOS):
        self.nomOS = nomOS
        self.versionOS = versionOS
        self.idImg = idImg
        self.baseOS = baseOS