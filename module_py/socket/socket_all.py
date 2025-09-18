
from flask_socketio import SocketIO
from module_py.socket.y_new_socket_handlers import SocketHandlers
from module_py.socket.message_service import MessageService
import threading
import sched
import time


class SocketAll:
    def __init__(self):
        print("SocketAll初始化!!!")
        self.cycle_begin=0


        self.socket_handlers=SocketHandlers()
        self.message_service=MessageService()

        self.clients=self.message_service.clients

        self.cycle_num=0
        # self.userSockets=self.socket_handlers.userSockets
        # self.deviceSocket=self.socket_handlers.deviceSocket



    def handle_connect(self):
        self.socket_handlers.handle_connect(self.clients)

    def handle_disconnect(self):
        self.socket_handlers.handle_disconnect(self.clients)

    def handle_client_message(self,data):
        self.socket_handlers.handle_client_message(data)

    def handle_login(self,data):
        self.socket_handlers.handle_login(data)

    def handle_register(self,data):
        self.socket_handlers.handle_register(data)

    def handle_create_character(self,data):
        self.socket_handlers.handle_create_character(data)

    def handle_check_character(self,data):
        self.socket_handlers.handle_check_character(data)


#############################################################
# 
# 
# 
# 游戏界面相关操作
#
#游戏在线检测机制不完全，刷新页面十秒内，脱离主界面但不会掉线，显示在线但无法访问，僵尸账号
#
#
#
# #############################################################

    def handle_check_online_over(self,data):
        self.socket_handlers.check_online_over()


    def check_online(self):
        while True:
            try:
                self.socket_handlers.check_online(self.socketio)
                self.socketio.sleep(2)
                self.cycle_num+=1
                print(f"循环次数：{self.cycle_num}")
            except Exception as e:
                print("检测在线异常",e)
                self.socketio.sleep(5)





    # def cycle_task_action(self,data):
    #     thread=threading.Thread(target=self.cycle_task)
    #     thread.start()




    def handle_ask_character_info(self,data):
        print("socketALL:请求人物信息")
        self.socket_handlers.handle_ask_character_info()
    
    def handle_talk_input_message(self,data):
        self.socket_handlers.handle_talk_input_message(data)

    def handle_ask_lowNpc_info(self,data):
        self.socket_handlers.handle_ask_lowNpc_info(data)
    
    def handle_ask_renew_db(self,data):
        #data接口：
        #type：”backpack” or
        #data：["backpack",character_id,item_id,item_num]
        self.socket_handlers.handle_ask_renew_db(data)
    
    def handle_ask_backpack(self,data):
        self.socket_handlers.handle_ask_backpack()
    
    def handle_ask_bagMagic_info(self,data):
        self.socket_handlers.handle_ask_bagMagic_info()

    def handle_ask_insert_myMapSite(self,data):
        print("socketALL:插入地图信息接收",data)
        self.socket_handlers.handle_ask_insert_myMapSite(data)

    def handle_ask_search_room_other(self):
        self.socket_handlers.handle_search_room_other()



    def init_socket(self,app):
        print("init_socket")

        self.socketio= SocketIO(app, cors_allowed_origins="*",async_mode='threading')

        # threading.Thread(target=self.check_online, daemon=True).start()
        #在使用线程启动会出现两个实例，无奈只能使用监听启动，成功修复，记录一下，疑问还未解答


        self.socketio.on_event('connect', self.handle_connect)
        self.socketio.on_event('disconnect', self.handle_disconnect)
        self.socketio.on_event('client_message', self.handle_client_message)
        self.socketio.on_event('login', self.handle_login)
        self.socketio.on_event('check_character', self.handle_check_character)

        # self.socketio.on_event('login',self.cycle_task_action)
        #不知道为什么，使用这个多线程就会导致卡壳


        self.socketio.on_event('register', self.handle_register)
        self.socketio.on_event('create_character', self.handle_create_character)

        self.socketio.on_event('check_online_over',self.handle_check_online_over)



        self.socketio.on_event('ask_character_info',self.handle_ask_character_info)
        self.socketio.on_event('ask_input_message',self.handle_talk_input_message)
        self.socketio.on_event('ask_lowNpc_info',self.handle_ask_lowNpc_info)
        self.socketio.on_event('ask_backpack_info',self.handle_ask_backpack)
        self.socketio.on_event('ask_bagMagic_info',self.handle_ask_bagMagic_info)
        self.socketio.on_event('ask_renew_db',self.handle_ask_renew_db)

        self.socketio.on_event('ask_insert_myMapSite',self.handle_ask_insert_myMapSite)

        self.socketio.on_event('ask_search_room_other',self.handle_ask_search_room_other)







