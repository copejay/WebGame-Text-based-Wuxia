from flask_socketio import socketio
import time
import random


class MessageService:
    def __init__(self):
        self.clients={}

    # # 存储客户端连接信息
    # clients = {}

    # 向所有客户端发送消息
    def send_to_all_clients():
        socketio.emit('order_talk_renew',"刷新聊天消息")


    # 向指定客户端发送消息
    def send_to_client(self,client_id, message):
        if client_id in self.clients:
            socketio.emit('server_command', {
                'action': 'show_message',
                'data': message,
                'timestamp': time.time()
            }, room=client_id)

    # 服务端定时任务
    def server_scheduled_task(self):
        while True:
            socketio.sleep(10)
            random_value = random.randint(1, 100)
            self.send_to_all_clients(f"服务端定时推送: 随机数 {random_value}")
    