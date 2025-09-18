
from db_main import SQLiteDBManager


class siteMap_tableManager(SQLiteDBManager):
    def __init__(self):
        super().__init__()
        self.table="siteMap"


    def create_table(self):
        try:
            self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {self.table} (character_id TEXT PRIMARY KEY , mapName TEXT, site_x INTEGER,site_y INTEGER)")
            self.conn.commit()
            print(f"表 {self.table} 创建成功")
        except Exception as e:
            print(f"创建表失败：{e}")

    def delete_mySite(self,cursor,conn,character_id):
        try:
            cursor.execute(f"DELETE FROM {self.table} WHERE character_id=?", (character_id,))
            conn.commit()
            print(f"siteMap:角色位置 {character_id} 删除成功")
            return True
        except Exception as e:
            print(f"siteMap:删除角色位置失败：{e}")
            return False


    def create_mySite(self,cursor,conn,character_id,mapName,site_x,site_y):
        try:
            cursor.execute(f"INSERT INTO {self.table} (character_id,mapName,site_x,site_y) VALUES (?,?,?,?)", (character_id,mapName,site_x,site_y))
            conn.commit()
            print(f"siteMap:角色位置 {character_id} 创建成功")
            return True
        except Exception as e:
            print(f"siteMap:创建角色位置失败：{e}")
            return False
        
    def update_mySite(self,cursor,conn,character_id,mapName,site_x,site_y):
        try:
            cursor.execute(f"UPDATE {self.table} SET mapName=?,site_x=?,site_y=? WHERE character_id=?", (mapName,site_x,site_y,character_id))
            conn.commit()
            print(f"siteMap:角色 {character_id} 更新成功")
            return True
        except Exception as e:
            print(f"siteMap:更新角色失败：{e}")
            return False
        
    def search_mySite(self,cursor,character_id):
        try:
            cursor.execute(f"SELECT mapName,site_x,site_y FROM {self.table} WHERE character_id=?", (character_id,))
            result= cursor.fetchone()
            # print(f"siteMap:根据{character_id} 查询结果：{result}")
            if result!=None:
                # print(f"siteMap:根据{character_id} 成功找到信息")
                return result
            else:
                print(f"siteMap:根据{character_id} 未找到信息")
                return False
        except Exception as e:
            print(f"siteMap:查询角色失败：{e}")
            return False
        
    def search_room_other(self,cursor,character_id):
        # print(f"siteMap发起{character_id}查询房间其他玩家")
        try:
            my_site=self.search_mySite(cursor,character_id)
            map_name=my_site[0]
            site_x=my_site[1]
            site_y=my_site[2]
            cursor.execute(f'SELECT *FROM {self.table} WHERE mapName=? AND site_x=? AND site_y=? AND character_id !=?',(map_name,site_x,site_y,character_id))
            result=cursor.fetchall()
            if len(result)!=0:
                # print(f"siteMap:根据{character_id} 成功找到房间其他玩家")
                return result
            else:
                # print(f"siteMap:根据{character_id} 未找到房间其他玩家")
                return False
        except Exception as e:
            print(f"siteMap:查询房间其他玩家失败：{e}")
            return False


# test=siteMap_tableManager()
# test.connect()
# test.delete_table("siteMap")
# test.create_table()
# test.close()
