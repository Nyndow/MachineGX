from database import db

class ImgOsys(db.Model):
    __tablename__ = 'imgOS'
    idImg = db.Column(db.Integer, primary_key=True)
    imgName = db.Column(db.String(30), nullable=False)

    def __init__(self, imgName):
        self.imgName = imgName