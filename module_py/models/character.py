

from module_py.db import db

class Character(db.Model):
    character_id=db.Column(db.String(6),primary_key=True,autoincrement=True)

    name=db.Column(db.String(6),unique=True)
    sex=db.Column(db.String(1))
    age=db.Column(db.Integer)

    level=db.Column(db.Integer)
    exp=db.Column(db.Integer)

    def __init__(self,character_id,name,sex):
        self.character_id=character_id;
        self.name=name
        self.sex=sex
        self.age=6
        self.level=1
        self.exp=0