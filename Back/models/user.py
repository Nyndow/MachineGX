from database import db

class User(db.Model):
    __tablename__ = 'user'
    idUser = db.Column(db.Integer, primary_key=True)
    userUsername = db.Column(db.String(30), nullable=False)
    userPassword = db.Column(db.String(30), nullable=False)
    numEmployee = db.Column(db.String(20), nullable=False)

    def __init__(self, userUsername, userPassword,numEmployee):
        self.userUsername = userUsername
        self.userPassword = userPassword
        self.numEmployee = numEmployee
