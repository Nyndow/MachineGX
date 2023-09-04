from database import db

class Option(db.Model):
    __tablename__ = 'option'
    idOption = db.Column(db.Integer, primary_key=True)
    idCommand = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(50), nullable=False)

    def __init__(self, idCommand, description):
        self.idCommand = idCommand
        self.description = description
