from module_py.db import db


class Account(db.Model):
    account=db.Column(db.String(20),primary_key=True)
    password=db.Column(db.String(20))
    character_id=db.Column(db.String(13),primary_key=True)

    def __init__(self,account,password):
        self.account=account
        self.password=password
        self.character_id=None
    

