from flask import Flask,render_template,request,jsonify
from flask_socketio import SocketIO,emit

from flask_cors import CORS
import time
import random
import os

import threading

from module_py.socket.socket_all import SocketAll


from module_py.db import db
from module_py.routes.db_talk import talk_bp

def create_app():
    app=Flask(__name__)
    app.config['SECRET_KEY']='secret!'
    app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///game.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False


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
        
    socketAll=SocketAll()

    socketAll.init_socket(app)

    if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
    #在这里由于对flask启动机制的误解，导致之前执行了两次，现在通过判断是否为主进程来决定是否执行多线程在线检查机制
        threading.Thread(target=socketAll.check_online, daemon=True).start()


    @app.route('/')
    def index():
        return render_template('main.html',socketio_url=request.host_url)
        
    return app,socketAll.socketio


if __name__== '__main__':
    print(os.environ.get('WERKZEUG_RUN_MAIN'))

    app, socketio = create_app()  # 必须创建实例，否则主进程会认为代码不完整
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)

