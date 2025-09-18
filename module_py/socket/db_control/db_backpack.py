
from db_main import SQLiteDBManager


class Backpack_tableManager(SQLiteDBManager):
    def __init__(self):
        super().__init__()
        self.table="backpack"


    def create_table(self):
        try:
            self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {self.table} (character_id TEXT, item_id TEXT, name TEXT , type INTEGER, num INTEGER,           PRIMARY KEY (character_id, item_id),FOREIGN KEY (character_id) REFERENCES player(character_id) ON DELETE CASCADE, FOREIGN KEY (item_id) REFERENCES item(item_id))")

            self.conn.commit()
            print(f"表 {self.table} 创建成功")
        except Exception as e:
            print(f"创建表失败：{e}")



    def check_item(self,cursor,character_id,item_id):
        try:
            cursor.execute(f"SELECT * FROM {self.table} WHERE character_id=? AND item_id=?", (character_id,item_id))
            result= cursor.fetchone()
            if result[0]!=None:
                print(f"backpack:根据{character_id}和{item_id} 成功找到信息")
                return True
            else:
                print(f"backpack:根据{character_id}和{item_id} 未找到信息")
                return False
        except Exception as e:
            print(f"查询物品失败：{e}")
            return False
    

    def create_item(self,cursor,conn,character_id,item_id,name,type,num):
        try:
            cursor.execute(f"INSERT INTO {self.table} (character_id,item_id,name,type,num) VALUES (?,?,?,?,?)", (character_id,item_id,name,type,num))
            conn.commit()
            print(f"backpack:物品 {item_id} 创建成功")
            return True
        except Exception as e:
            print(f"创建物品失败：{e}")
            return False


    def update_item(self,cursor,conn,character_id,item_id,name,type,num):
        check_result=self.check_item(cursor,character_id,item_id)
        if check_result==True:
            try:
                cursor.execute(f"UPDATE {self.table} SET num=num+? WHERE character_id=? AND item_id=?", (num,character_id,item_id))
                conn.commit()
                print(f"backpack:物品 {item_id} 数量更新成功")
                return True
            except Exception as e:
                print(f"更新物品失败：{e}")
                return False
        else:
            self.create_item(cursor,conn,character_id,item_id,name,type,num)


    def search_backpack_byID(self,cursor,character_id):
        try:
            cursor.execute(f"SELECT * FROM {self.table} WHERE character_id=?", (character_id,))
            result= cursor.fetchall()
            if result[0]!=None:
                print(f"backpack:根据{character_id} 成功找到信息")
                return result
            else:
                print(f"backpack:根据{character_id} 未找到信息")
                return False
        except Exception as e:
            print(f"查询物品为空：{e}")
            return False
            

# test=Backpack_tableManager()
# test.connect()

# test.delete_table("backpack")
# test.create_table()

# # test.create_item("2","Gu_aiqing","爱情仙蛊","武器",1)
# # test.update_item("1","1",1)
# test.close()

    

