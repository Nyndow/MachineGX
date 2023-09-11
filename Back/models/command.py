from database import db

class Command(db.Model):
    __tablename__ = 'command'
    idCommand = db.Column(db.Integer, primary_key=True)
    commandDescription = db.Column(db.String(100), nullable=False)
    commandName = db.Column(db.String(30), nullable=False)
    commandComment = db.Column(db.String(200), nullable=True)
    baseOS = db.Column(db.String(10), nullable=False)

    def __init__(self, commandDescription, commandName,commandComment, baseOS):
        self.commandDescription = commandDescription
        self.commandName = commandName
        self.commandComment = commandComment
        self.baseOS = baseOS


