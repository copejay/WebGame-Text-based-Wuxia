import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask_socketio import emit

from flask import request
# from module_py.socket.message_service import send_to_all_clients, clients
from db_control.control_all import Control_all

import traceback
import threading


class SocketHandlers:

    def __init__(self):
       
    #    print('hello') 
    #实例id号
       self.instance_id=id(self)
#数据库总控
       self.db_controller=Control_all()

#存储【账号】和【设备id】的映射关系
       self.account_device={}
    #    self.userSockets={}
#存储【设备id】和【sid】的映射关系
       self.device_sid={}
#存储需要检测的设备id
       self.need_check_list=[]
#存储需要删除的设备id
       self.need_delete_list=[]
        # 设置初始化标志

    # 客户端连接事件
    def handle_connect(self,clients):
        device_id=request.args.get('deviceId')
        # self.account_device[device_id]=True
        self.device_sid[device_id]=request.sid

        client_id = request.sid
        clients[client_id] = True
        print(f"设备 {device_id} 已连接,Sid:{client_id}，当前连接数: {len(clients)}")
        emit('server_response', {'data': '连接成功，等待服务端指令'})


    # 客户端断开连接事件
    def handle_disconnect(self,clients):
        try:
            client_id = request.sid
            if client_id in clients:
                del clients[client_id]
            print(f"客户端 {client_id} 已断开，当前连接数: {len(clients)}")
            # 断开连接时，删除用户信息
            for device_id ,sid in self.device_sid.items():
                self.need_check_list.append(device_id)
                if sid==request.sid:
                    del self.device_sid[device_id]
                    print(f"设备断连，解除终端通路{device_id}绑定")
        except Exception as e:
            print(f"断开连接异常：{e}")


    # 接收客户端消息事件
    def handle_client_message(self,message):
        print(f"收到客户端消息: {message}")
        emit('server_response', {'data': f'已收到你的消息: {message}'})


    #接收客户端登录消息
    def handle_login(self,login_news):
        print(f"用户发起登录")
        #补充，添加账号密码验证，通过之后，将用户信息存储到userSockets中，完成物理身份和游戏身份的绑定
        if self.db_controller.login_check(login_news['account'],login_news['password']):
            device_id=request.args.get('deviceId')
            #处理同一客户端登录多个账号
            for account,c_device_id in list(self.account_device.items()):
                if c_device_id == device_id:

                    print("用户重复登录")
                    del self.account_device[account]
                    print("删除旧的绑定")
                    self.account_device[login_news['account']]=device_id
                    print("发送登录成功消息到终端")
                    emit('login_response',{'data':'登录成功！','code':0})
                    return
            self.account_device[login_news['account']]=device_id
            print("发送登录成功消息到终端")
            emit('login_response',{'data':'登录成功！','code':0})
        else:
            emit('login_response',{'data':'登录失败！','code':1})


    #接收客户端注册消息
    def handle_register(self,register_news):
        print(f"用户发起注册")
        print("收到的注册数据:", register_news) 
        result=self.db_controller.create_player(register_news['account'],register_news['password'])
        if result:
            emit('register_response',{'data':'注册成功！','code':0})
        else:
            print(result)
            emit('register_response',{'data':'注册失败！','code':1})

    def handle_check_character(self,data):
        print(f"用户发起检查角色")
        print("收到的检查角色数据:", data['account'])
        account=data['account']
        result=self.db_controller.check_character(account)
        if result==True:
            emit('check_character_response',{'data':'有角色！','code':0})
        else:
            emit('check_character_response',{'data':'无角色！','code':1})


    #接收客户端创建角色消息
    def handle_create_character(self,data):
        print(f"用户发起创建角色")
        print("收到的创建角色数据:", data['name'],data['sex'])
        try:
            this_account=self.search_account_byRequest()
            if this_account!=False:
                result=self.db_controller.create_character(this_account,data['name'],data['sex'])
                if result==True:
                    emit('create_character_response',{'data':'创建角色成功！','code':0})
                    return True
                else:
                    emit('create_character_response',{'data':'创建角色失败！','code':1})
                    return False
            else:
                print("未找到对应的账号")
                return False
        except Exception as e:
            print(f"创建角色失败：{e}")
            emit('create_character_response',{'data':'创建角色失败！','code':1})



#############################################################
# 
#
#游戏界面相关操作
#
#备注：断线重连基本解决，但是还是需要增加检查机制，在固定时间之后主动断开连接，而非等待用户重新登录刷新。初步实现功能，还需要后续检查是否有逻辑问题。-8.17，10:00,CopeJay
#error:当没有连接时，device好像会被清空//好像时flask在更改时会重启应用
#
#
#
# #############################################################

############################################
# 
# 
# 数据库操作，【增】区
# 
# 
# #######################################################

    def handle_talk_input_message(self,data):
        print(f"用户输入聊天消息")
        character_info=self.handle_ask_character_info()
        name=character_info[0]
        if name != None:
            self.db_controller.input_message(name,data,404)
            emit('response_talk',{'data':'聊天消息发送成功！','code':0})
            data=self.handle_ask_talk_message()
            self.order_to_allPlayer("talk_renew",data)
        else:
            emit('response_talk',{'data':'聊天消息发送失败！','code':1})


##########################################
# 
# 
# 
# 数据库操作【改】区
# 
# 
# 
# 
# ####################################################

    def handle_ask_renew_db(self,data):
        #data接口：
        #type：”backpack” or “person_base_data”
        #data：["backpack",character_id,item_id,item_num] or ["person_base_data",character_id,sex,age,height,weight]
        if self.check_player():
            print(f"用户发起更新数据库信息")
            #这边的数据库操作具有风险
            #不能根据用户提交直接更新，需要进行多次身份验证确保更新操作合法
            #为了方便，暂时先这样算了
            print(data)
            if data["type"]=="person_base_data":
                self.db_controller.renew_character_info(data["data"][0],data["data"])
                emit('response_renew_db',{'data':'更新成功！','code':0})

            elif data["type"]=="backpack":
                print(f'handles:接收到的更新背包信息:{data}')
                check_result=self.handle_ask_itemIdType_byName(data["data"][0])
                if check_result!=False:
                    item_IdType=self.handle_ask_itemIdType_byName(data["data"][0])
                    characterInfo=self.handle_ask_character_info_all()
                    #[id,info]
                    character_id=characterInfo[0]
                    item_id=item_IdType[0]
                    item_name=data["data"][0]
                    item_type=item_IdType[1]
                    num=data["data"][1]
                    self.db_controller.update_item(character_id,item_id,item_name,item_type,num)
                    emit('response_renew_db',{'data':'更新成功！','code':0})
                else:
                    emit('response_renew_db',{'data':'更新失败！','code':1})
            else:
                self.handle_renew_db_bagMagic(data)


    def handle_renew_db_bagMagic(self,data):
        if data["type"]=="add_bagMagic":
            character_id=self.handle_ask_character_info_all()[0]
            magic_name=data["data"][0]
            magic_id=self.db_controller.search_magic_byName(magic_name)[0]
            add_result=self.db_controller.add_bagMagic(character_id,magic_id,magic_name)
            if add_result!=False:
                print(f"增加武功【{magic_name}】成功")
            else:
                print(f"增加武功【{magic_name}】失败")
        elif data["type"]=="up_bagMagic":
            print("更新武功")
        elif data["type"]=="del_bagMagic":
            print("删除武功")



######################################
# 
# 
#
#
#
#
# 数据库操作，【查】区
# 
# 
# 
# ##############################################

    # def auto_sameRoom_order(self,)

    def handle_search_room_other(self):
        if self.check_player():
            # print(f"handle:检测通过，用户发起查找地图位置信息")
            character_info=self.handle_ask_character_info_all()
            character_id=character_info[0]
            other_result=self.db_controller.search_room_other(character_id)
            if other_result!=False:
                # print(f"!!!地图检测到其他人{other_result}")
                emit('response_search_room_other',{'data':other_result,'code':0})
            else:
                # print("")
                # print("地图检测到无人")
                emit('response_search_room_other',{'data':other_result,'code':1})
        else:
            print("handle:检测失败，用户未登录")


    def handle_delete_myMapSite(self,account):
        # if self.check_player():
            # character_info=self.handle_ask_character_info_all()
            character_info=self.db_controller.get_character_info_all(account)
            character_id=character_info[0]
            delete_result=self.db_controller.delete_myMapSite(character_id)
            if delete_result!=False:
                print("删除角色位置成功")
                # emit('response_delete_myMapSite',{'data':'删除成功！','code':0})
            else:
                print("删除角色位置失败")
                # emit('response_delete_myMapSite',{'data':'删除失败！','code':1})
        # else:
        #     print("handle:用户资格检测失败")


    def handle_ask_insert_myMapSite(self,data):
        if self.check_player():
            print(f"handle:检测通过，用户发起插入地图位置信息")
            character_info=self.handle_ask_character_info_all()
            character_id=character_info[0]
            room_id=data["map_name"]
            x=data["x"]
            y=data["y"]
            check_result=self.db_controller.search_myMapSite(character_id)
            if check_result!=False:
                print("已存在记录，直接更新")
                insert_result=self.db_controller.update_myMapSite(character_id,room_id,x,y)
                if insert_result!=False:
                    emit('response_insert_myMapSite',{'data':'插入成功！','code':0})
                else:
                    emit('response_insert_myMapSite',{'data':'插入失败！','code':1})
            else:
                print("首次提交，先创建记录")
                create_result=self.db_controller.create_myMapSite(character_id,room_id,x,y)
                if create_result!=False:
                    emit('response_insert_myMapSite',{'data':'创建成功！','code':0})
                else:
                    emit('response_insert_myMapSite',{'data':'创建失败！','code':1})
            # other_result=self.db_controller.search_room_other(character_id)
            # if other_result!=False:
            #     print(f"地图检测到其他人{other_result}")
            # else:
            #     print("地图检测到无人")
            # other_player_info=self.db_controller.search_other_player(room_id,character_id)
            # if other_player_info!=False:
            #     emit('response_insert_myMapSite',{'data':other_player_info,'code':0})
            # else:
            #     emit('response_insert_myMapSite',{'data':'查询失败！','code':1})
        else:
            emit('response_insert_myMapSite',{'data':'查询失败！','code':1})


#物品表

    #这个方法只会在内部调用，所以返回布尔值就可以了
    def handle_ask_itemIdType_byName(self,item_name):
        item_id_type=self.db_controller.search_itemIdType_byName(item_name)
        #[id,type]
        if item_id_type!=False:
            print(f"handle：物品表查询成功，物品id:{item_id_type[0]},物品类型:{item_id_type[1]}")
            return item_id_type
        else:
            print("handle：物品表查询失败")
            return False
    
#武功表

    def handle_ask_bagMagic_info(self):
        if self.check_player():
            character_info=self.handle_ask_character_info_all()
            character_id=character_info[0]
            bagMagic_info=self.db_controller.search_bagMagic_byId(character_id)
            if bagMagic_info!=False:
                emit('response_bagMagic',{'data':bagMagic_info,'code':0})
            else:
                print("handlers:武功库为空")
                emit('response_bagMagic',{'data':'查询失败！','code':1})
        else:
            emit('response_bagMagic',{'data':'查询失败！','code':1})


#背包表
    def handle_ask_backpack(self):
        print("用户发起查询背包信息")
        if self.check_player():
            print(f"用户资格验证通过")
            character_info=self.handle_ask_character_info_all()
            character_id=character_info[0]
            if character_id != None:
                backpack_info=self.db_controller.search_backpack_byID(character_id)
                if backpack_info!=False:
                    emit('response_backpack',{'data':backpack_info,'code':0})
                else:
                    emit('response_backpack',{'data':'查询失败！','code':1})
            else:
                emit('response_backpack',{'data':'查询失败！','code':1})

#角色表
    def handle_ask_character_info_all(self):
        #这个查询包含角色id和角色信息
        this_account=self.search_account_byRequest()
        if this_account!=False:
            character_info=self.db_controller.get_character_info_all(this_account)
            # print(f"查询结果:{character_info}")
            return character_info
        else:
            print("handler:查找角色全部信息失败")

    
    def handle_ask_character_info(self):
        print(f"用户发起查询角色信息")
        try:
            this_account=self.search_account_byRequest()
            if this_account!=False:
                character_info=self.db_controller.get_character_info(this_account)
                # print(f"查询结果:{character_info}")

                emit('response_character_info',{'data':character_info,'code':0})
                #开局自动更新一次聊天消息
                #挂在玩家更新逻辑这里
                data=self.handle_ask_talk_message()
                self.order_to_allPlayer("talk_renew",data)
                return character_info
            else:
                print("未找到对应的账号")
        except Exception as e:
            print(f"查询玩家信息失败：{e}")
            emit('response_character_info',{'data':'查询玩家信息失败！','code':1})

#聊天表
    def handle_ask_talk_message(self):
        print(f"查询聊天消息")
        data_list=self.db_controller.search_talk_data()
        emit('response_talk_message',{'data':data_list,'code':0})
        return data_list


    def order_to_allPlayer(self,order,data):
        # for account,sid in self.userSockets.items():
        #消息广播不会识别终端是否登录了账号，只要有连接，就可以在主场景接收广播信息
        for device_id,sid in self.device_sid.items():
            emit('order_to_allPlayer',{'order':order,'data':data,'code':0},room=sid)

#npc表
    def handle_ask_lowNpc_info(self,data):
        if self.check_player():
            # print("身份验证通过")
            npc_list=self.db_controller.search_lowNpc_list(data)
            emit('response_lowNpc_info',{'data':[list(item) for item in npc_list],'code':0})





#888888888888888888888888888888

#############################
######################
#######################
# ####################
# 在线检查相关操作
# ##########################
# #########################
# #######################
# ###############################
# ######################################
    def check_online_over(self):
        sid=request.sid
        for device_id,sid in self.device_sid.items():
            if sid == sid:
                c_device_id=device_id
                print(f"设备排除离线嫌疑:{c_device_id}")
                self.need_delete_list.remove(c_device_id)
            else:
                print(f"此设备无连接:{c_device_id}")


#定时器访问的self,好像存在不一致的bug
    def check_online(self,socketio):

        print("开始检查")
        print(f"实例 {self.instance_id} 开始检查")
            # 打印调用栈，定位是谁调用了这个函数
        # print("调用栈：")
        # traceback.print_stack()  
        #这里存在一个诡异的bug，总是识别为空
        print(f"在线检查器运行中,在线终端:{len(self.device_sid)}")
        print(self.device_sid)
        print(f"在线检查器运行中,在线用户:{len(self.account_device)}")
        print(self.account_device)

        #保持连接但是不在主界面的情况
        for dl_device_id in list(self.need_delete_list):
            self.need_delete_list.remove(dl_device_id)
            for account,dl2_device_id in list(self.account_device.items()):
                if dl_device_id == dl2_device_id:
                    del self.account_device[account]
                    self.handle_delete_myMapSite(account)
                    # self.need_delete_list.remove(dl2_device_id)
                    print(f"设备断连确定，解除账号-终端{dl2_device_id}绑定")
                    print(f"设备断连确定，删除角色位置:{dl2_device_id}")
                    # self.handle_delete_myMapSite(account)

        for device_id in list(self.need_check_list):
            self.need_delete_list.append(device_id)
            print(f"预备删除设备:{device_id}")

            self.need_check_list.remove(device_id)
            socketio.emit("check_online",{'data':device_id},room=self.device_sid[device_id])

        #完全离线的情况检测
        for account,device_id in list(self.account_device.items()):
            print("日常检测执行。。")
            print(f"device_sid:{self.device_sid}")
            if device_id not in self.device_sid.keys():
                print(f"检测到疑似掉线设备{device_id}")
                self.need_check_list.append(device_id)
                # del self.account_device[account]


    def check_player(self):
        # print(f"确认账号-终端信息")
        try:
            check_device=request.args.get('deviceId')
            result=self.search_account_byRequest()
            if result!=False:
                # print("check over: 成功！")
                return True
            else:
                print("check over: 失败！")
                emit('order_to_onePlayer',{'order':"you_ara_out",'data':"null",'code':0},room=self.device_sid[check_device])
                    #这里发生过一个bug，由于对return的调用导致，注意检查return导致的逻辑变化。
        except Exception as e:
            print(f"身份验证失败：{e}")
            return False
        

    def search_account_byRequest(self):
        # print("根据请求查询账号")
        try: 
            # print("开始扫描账号-终端号")
            num=1
            # print("deviceSocket内容:",self.account_device)
            check_device=request.args.get('deviceId')
            # print(f"!!!检查的device:{check_device}")
            for account,device_id in self.account_device.items():
                # print(f"扫描次数:{num}")
                num+=1
                if check_device == device_id:
                    # print(f"找到对应的账号,相等:{device_id},{check_device}")
                    # this_account=account
                    return account
            print(f"未找到对应的账号,不相等:{check_device}")
            return False
        except Exception as e:
            print(f"根据请求查询账号失败：{e}")
            return False
        
    # def handle_ask_character_info_all(self):
    #     #这个查询包含角色id和角色信息
    #     this_account=self.search_account_byRequest()
    #     if this_account!=False:
    #         character_info=self.db_controller.get_character_info_all(this_account)
    #         print(f"查询结果:{character_info}")
    #         return character_info


    
    # def handle_ask_character_info(self):
    #     print(f"用户发起查询角色信息")
    #     try:
    #         this_account=self.search_account_byRequest()
    #         if this_account!=False:
    #             character_info=self.db_controller.get_character_info(this_account)
    #             print(f"查询结果:{character_info}")

    #             emit('response_character_info',{'data':character_info,'code':0})
    #             #开局自动更新一次聊天消息
    #             #挂在玩家更新逻辑这里
    #             data=self.handle_ask_talk_message()
    #             self.order_to_allPlayer("talk_renew",data)
    #             return character_info
    #         else:
    #             print("未找到对应的账号")
    #     except Exception as e:
    #         print(f"查询玩家信息失败：{e}")
    #         emit('response_character_info',{'data':'查询玩家信息失败！','code':1})


    # def handle_ask_talk_message(self):
    #     print(f"查询聊天消息")
    #     data_list=self.db_controller.search_talk_data()
    #     emit('response_talk_message',{'data':data_list,'code':0})
    #     return data_list



    # def order_to_allPlayer(self,order,data):
    #     # for account,sid in self.userSockets.items():
    #     #消息广播不会识别终端是否登录了账号，只要有连接，就可以在主场景接收广播信息
    #     for device_id,sid in self.device_sid.items():
    #         emit('order_to_allPlayer',{'order':order,'data':data,'code':0},room=sid)


    # def handle_ask_lowNpc_info(self,data):
    #     if self.check_player():
    #         # print("身份验证通过")
    #         npc_list=self.db_controller.search_lowNpc_list(data)
    #         emit('response_lowNpc_info',{'data':[list(item) for item in npc_list],'code':0})

    