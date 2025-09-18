
from db_main import SQLiteDBManager


class Item_tableManager(SQLiteDBManager):
    def __init__(self):
        super().__init__()
        self.table="item"


    def create_table(self):
        try:
            self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {self.table} (item_id TEXT PRIMARY KEY, name TEXT UNIQUE, describe TEXT, type TEXT, funcNum INTEGER, func1_type TEXT DEFAULT NULL, func1_value INTEGER DEFAULT NULL, func2_type TEXT DEFAULT NULL, func2_value INTEGER DEFAULT NULL, func3_type TEXT DEFAULT NULL,func3_value INTEGER DEFAULT NULL)")

            self.conn.commit()
            print(f"表 {self.table} 创建成功")
        except Exception as e:
            print(f"创建表失败：{e}")


    def create_item(self,item_id,name,describe,type,funcNum,func1_type,func1_value,func2_type,func2_value,func3_type,func3_value):
        try:
            self.cursor.execute(f"INSERT INTO {self.table} (item_id,name,describe,type,funcNum,func1_type,func1_value,func2_type,func2_value,func3_type,func3_value) VALUES (?,?,?,?,?,?,?,?,?,?,?)", (item_id,name,describe,type,funcNum,func1_type,func1_value,func2_type,func2_value,func3_type,func3_value))
            self.conn.commit()
            print(f"item:物品 {name} 创建成功")
            return True
        except Exception as e:
            print(f"创建物品失败：{e}")
            return False


    def search_item_by_name(self,cursor,name):
        try:
            cursor.execute(f"SELECT * FROM {self.table} WHERE name = ?",(name,))
            result= cursor.fetchone()
            if result[0]!=None:
                print(f"item:根据{name} 成功找到信息")
                return result
            else:
                print(f"item:根据{name} 未找到信息")
                return None
        except Exception as e:
            print(f"查询失败：{e}")
            return None
        
        
    def search_itemIdType_byName(self,cursor,name):
        try:
            cursor.execute(f"SELECT item_id,type FROM {self.table} WHERE name = ?",(name,))
            result= cursor.fetchone()
            if result[0]!=None:
                print(f"item:根据{name} 成功找到信息")
                return result
            else:
                print(f"item:根据{name} 未找到信息")
                return None
        except Exception as e:
            print(f"查询失败：{e}")
            return None
