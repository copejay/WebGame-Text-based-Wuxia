from module_py.db import db


class Talk(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(10),primary_key=False)
    message=db.Column(db.String(50),unique=False)
    time=db.Column(db.String(50),unique=False)
    
    def __init__(self,name,message,time):
        self.name=name
        self.message=message
        self.time=time