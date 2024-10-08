from database import db

class Administration(db.Model):
    __tablename__ = 'administration'
    idAdmin = db.Column(db.Integer, primary_key=True)
    numEmployee = db.Column(db.String(20), nullable=False)
    adminUsername = db.Column(db.String(50), unique=True, nullable=False)
    adminPassword = db.Column(db.String(50), nullable=False)
    isAdmin = db.Column(db.Boolean,nullable=False)

    def __init__(self, adminUsername, adminPassword, numEmployee,isAdmin=False):
        self.adminUsername = adminUsername
        self.adminPassword = adminPassword
        self.numEmployee = numEmployee
        self.isAdmin = isAdmin
