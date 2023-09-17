from database import db

class OSys(db.Model):
    __tablename__ = 'oSys'
    idOS = db.Column(db.String(10), primary_key=True)
    nomOS = db.Column(db.String(20), nullable=False)
    versionOS = db.Column(db.Integer, nullable=False)
    imgOS = db.Column(db.String(20), nullable=False)

    def __init__(self, idOS, nomOS, versionOS, imgOS):
        self.idOS = idOS
        self.nomOS = nomOS
        self.versionOS = versionOS
        self.imgOS = imgOS
