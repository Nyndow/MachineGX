from database import db

class Command(db.Model):
    __tablename__ = 'command'
    idCommand = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    cible = db.Column(db.String(200), nullable=False)

    def __init__(self, description, cible):
        self.description = description
        self.cible = cible


