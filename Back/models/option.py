from database import db

class Option(db.Model):
    __tablename__ = 'option'
    idOption = db.Column(db.Integer, primary_key=True)
    idCommand = db.Column(db.Integer, nullable=False)
    optionDescription = db.Column(db.String(50), nullable=False)
    optionSyntax = db.Column(db.String(50), nullable=True) 
    optionComment = db.Column(db.String(100), nullable=True)
    target = db.Column(db.String(200), nullable=True)

    def __init__(self, idCommand, optionDescription, optionSyntax, optionComment=None, target=None):
        self.idCommand = idCommand
        self.optionDescription = optionDescription
        self.optionSyntax = optionSyntax
        self.optionComment = optionComment
        self.target = target