import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db_player import Player_tableManager
from db_character import Character_tableManager
from db_talk import Talk_tableManager
from db_lowNPC import lowNPC_tableManager
from db_item import Item_tableManager
from db_magic import Magic_tableManager
from db_siteMap import siteMap_tableManager

from db_backpack import Backpack_tableManager
from db_bagMagic import bagMagic_tableManager

#############################################################
# 
# 
# 
# tip:高并发问题等待解决，先把功能做齐全再说，暂时不是问题
# tip:高并发通过上下文管理器解决，多线程不再冲突
# 
# 
# #######################################################


class Control_all:
    def __init__(self):
        self.player_table=Player_tableManager()
        self.talk_table=Talk_tableManager()
        self.character_table=Character_tableManager()
        self.lowNpc=lowNPC_tableManager()
        self.item_table=Item_tableManager()
        self.magic_table=Magic_tableManager()
        self.backpack_table=Backpack_tableManager()
        self.bagMagic_table=bagMagic_tableManager()
        self.siteMap_table=siteMap_tableManager()


    
    def connect(self):
        self.player_table.connect()
        self.talk_table.connect()
        self.character_table.connect()
        self.lowNpc.connect()


      
    def close(self):
        self.player_table.close()
        self.talk_table.close()
        self.character_table.close()
        self.lowNpc.close()



    def create_player(self,account,password,character_id=None):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            register_result=self.player_table.create_player(cursor,conn,account,password,character_id)
            # self.close()
            return register_result


#用户表

    def login_check(self,account,password):
        with self.talk_table.get_connection() as (cursor,conn):
            login_result=self.player_table.login_check(cursor,account,password)
            # self.close()
            return login_result
        
    def get_character_info_all(self,account):
        with self.talk_table.get_connection() as (cursor,conn):
            player_id=self.player_table.searchID_byAccount(cursor,account)
            player_info=self.character_table.searchInfo_byID(cursor,self.player_table.searchID_byAccount(cursor,account))
            if player_info:
                return [player_id,player_info]
            else:
                print("dbControl:查询角色信息失败")
                return None
    
    
#角色表
    def get_character_info(self,account):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            player_info=self.character_table.searchInfo_byID(cursor,self.player_table.searchID_byAccount(cursor,account))
            if player_info:
                # self.close()
                print("dbControl:查询角色信息成功")
                return player_info
            else:
                print("dbControl:查询角色信息失败")
                # self.close()
                return None
    
    def check_character(self,account):
        with self.talk_table.get_connection() as (cursor,conn):
        # self.connect()
            check_result=self.player_table.searchID_byAccount(cursor,account)
            self.close()
            if check_result!=False:
                return True
            else:
                return False


    def create_character(self,account,name,sex):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            create_result=self.character_table.create_character(cursor,conn,name,sex)
            if create_result:
                print("dbControl:角色创建成功")

                add_result=self.player_table.player_add_character(cursor,conn,account,self.character_table.searchID_byName(cursor,name))
                if add_result:
                    print("dbControl:角色绑定成功")

                    # self.close()
                    return True
                else:
                    self.character_table.delete_character(cursor,conn,name)
                    print("dbControl:账号角色已满，删除new角色")
                    # self.close()
                    return False
            else:
                print("dbControl:角色创建失败")
                self.close()
                return False
        
    
#聊天信息表
    def input_message(self,name,message,time):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            self.talk_table.input_message(cursor,conn,name,message,time)
            # self.close()
            return True
    
    def search_talk_data(self):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            data_list=self.talk_table.search_table_data(cursor)
            # self.close()
            print("dbControl:查询聊天消息成功")
            return data_list
    
    
#普通npc表
    def search_lowNpc_list(self,name_list):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            npc_list=[]
            for name in name_list:
                npc_list.append(self.lowNpc.search_npc(cursor,name))
            # self.close()
            print(f"npc列表:{npc_list}")
            return npc_list
    
    def renew_character_info(self,name,info):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            result=self.character_table.renew_character_info(cursor,conn,name,info)
            # self.close()
            if result:
                return True
            else:
                return False
            
#背包存储表
    def search_backpack_byID(self,character_id):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            result=self.backpack_table.search_backpack_byID(cursor,character_id)
            # self.close()
            if result:
                return result
            else:
                return False
            

#物品表
    def update_item(self,character_id,item_id,name,type,num):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            result=self.backpack_table.update_item(cursor,conn,character_id,item_id,name,type,num)
            # self.close()
            if result:
                return True
            else:
                return False
            
    def search_itemIdType_byName(self,item_name):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            result=self.item_table.search_itemIdType_byName(cursor,item_name)
            # self.close()
            if result:
                return result
            else:
                print("control_all:查询物品失败")
                return False
            
#武功表
    def search_magic_byName(self,magic_name):
        with self.talk_table.get_connection() as (cursor,conn):
            result=self.magic_table.search_magic_byName(cursor,magic_name)
            if result!=False:
                return result
            else:
                return False
            
#角色武功背包表
            
    def search_bagMagic_byId(self,character_id):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            result=self.bagMagic_table.search_bagMagic_byId(cursor,character_id)
            # self.close()
            if result:
                return result
            else:
                return False
            
    def add_bagMagic(self,character_id,magic_id,magic_name):
        with self.talk_table.get_connection() as (cursor,conn):
            result=self.bagMagic_table.insert_bagMagic(cursor,conn,character_id,"True",1,magic_id,magic_name)
            if result!=False:
                return True
            else:
                return False
            
    def update_magic_level(self,character_id,magic_id,level):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            result=self.bagMagic_table.updata_level(cursor,conn,character_id,magic_id,level)
            # self.close()
            if result:
                return True
            else:
                return False
            
    def update_magic_equip(self,character_id,magic_id,equip):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            result=self.bagMagic_table.updata_equip(cursor,conn,character_id,magic_id,equip)
            # self.close()
            if result:
                return True
            else:
                return False
            

#角色地图位置表
    def search_myMapSite(self,character_id):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            result=self.siteMap_table.search_mySite(cursor,character_id)
            # self.close()
            if result:
                return result
            else:
                return False
            
            
    def delete_myMapSite(self,character_id):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            result=self.siteMap_table.delete_mySite(cursor,conn,character_id)
            # self.close()
            if result:
                return True
            else:
                return False
    
    def create_myMapSite(self,character_id,mapName,site_x,site_y):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            result=self.siteMap_table.create_mySite(cursor,conn,character_id,mapName,site_x,site_y)
            # self.close()
            if result:
                return True
            else:
                return False
            

    def update_myMapSite(self,character_id,mapName,site_x,site_y):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            result=self.siteMap_table.update_mySite(cursor,conn,character_id,mapName,site_x,site_y)
            # self.close()
            if result:
                return True
            else:
                return False
            
    def search_room_other(self,character_id):
        with self.talk_table.get_connection() as (cursor,conn):
            # self.connect()
            result=self.siteMap_table.search_room_other(cursor,character_id)
            # self.close()
            if result:
                # print(f"地图检测到他人id{result}")
                character_list=[]
                for i in result:
                    character_id=i[0]
                    character_info=self.character_table.searchInfo_byID(cursor,character_id)
                    character_list.append(character_info)
                    #character:name,age,sex,level,exp
                return character_list
            else:
                return False
            
    









    # def player_add_character(self,account,character_id):
    #     self.connect()
    #     self.player_table.player_add_character(account,character_id)
    #     self.close()

