from flask import Flask, render_template,jsonify
from flask_cors import CORS

from module_py.db import db
from module_py.routes.db_talk import talk_bp

def create_app():

    app=Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///game.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATION']=False

    db.init_app(app)

    if hasattr(db,'app'):
        print(f"绑定状态：{db.app==app}")
    else:
        try:
            with app.app_context():
                print("数据库已经绑定app")
        except:
            print("数据库未绑定app")

    app.register_blueprint(talk_bp)

    with app.app_context():
        db.create_all()

    @app.route('/')
    def home():
        return render_template('main.html')
    
    
    return app


if __name__== '__main__':
    app=create_app()
    app.run(host='0.0.0.0',port=5000,debug=True)