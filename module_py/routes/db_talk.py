
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from module_py.db import db
from module_py.models.talk import Talk
from flask import Flask,request,jsonify,Blueprint


talk_bp=Blueprint('api',__name__,url_prefix='/api')

@talk_bp.route('/add_talk',methods=['GET'])
def add_talk():
    try:
        name=request.args.get('name')
        message=request.args.get('message')
        time=request.args.get('time')
        print(f"收到数据1: {name}, {message}, {time}")

        if not all([name,message,time]):
            return jsonify({"status":"missing parameters"}),400
        
        talk_message=Talk(name=name,message=message,time=int(time))
        db.session.add(talk_message)
        db.session.flush()
        db.session.commit()
        return jsonify({"static":"add talk message success"})
    except Exception as e:
        print(f"错误详情：{str(e)}")
        db.session.rollback()
        print("error add")
        return jsonify({"static":"add fail"})


@talk_bp.route('/get_talk',methods=['GET'])
def get_talk():
    try:
        talk_message=Talk.query.all()
        message_list=[
            {
                'name':message.name,
                'message':message.message,
                'time':message.time
            }
            for message in talk_message
            ]
        return jsonify({'data':message_list})
    except Exception as e:
        print(f"数据库查询错误{str(e)}")
        return jsonify({
            'error':"get data error"
            })
