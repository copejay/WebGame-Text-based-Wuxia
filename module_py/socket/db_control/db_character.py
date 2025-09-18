
from db_main import SQLiteDBManager


class Character_tableManager(SQLiteDBManager):
    def __init__(self):
        super().__init__()
        self.table="character"


    def create_table(self):
        try:
            self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {self.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, age INTEGER,sex TEXT,level INTEGER, exp INTEGER, create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")

            self.conn.commit()
            print(f"表 {self.table} 创建成功")
        except Exception as e:
            print(f"创建表失败：{e}")

    # def search(self):
    #     try:
    #         self.cursor.execute(f"SELECT * FROM {self.table}")
    #         results= self.cursor.fetchall()
    #         print("表内容查询结果：")
    #         for row in results:
    #             print(row)
    #     except Exception as e:
    #         print(f"查询失败：{e}")


    def create_character(self,cursor,conn,name,sex):
        try:
            cursor.execute(f"INSERT INTO {self.table} (name,age, sex,level,exp) VALUES (?,?,?,?,?)", (name,18,sex,0,0))
            conn.commit()
            print(f"character:角色 {name} 创建成功")
            return True
        except Exception as e:
            print(f"创建角色失败：{e}")
            return False



    def delete_character(self,cursor,conn,name):
        try:
            cursor.execute(f"DELETE FROM {self.table} WHERE name = ?",(name,))
            conn.commit()
            print(f"character:角色 {name} 删除成功")

        except Exception as e:
            print(f"删除角色失败：{e}")



    def searchInfo_byID(self,cursor,id):
        try:
            # print(f"character:开始通过id查询信息")
            cursor.execute(f"SELECT name,age,sex,level,exp FROM {self.table} WHERE id = ?",(id,))
            result= cursor.fetchone()
            if result[0]!=None:
                # print(f"character:根据{id} 成功找到信息")
                return result
            else:
                print(f"character:根据{id} 未找到信息")
                return None
        except Exception as e:
            print(f"character:查询失败：{e}")
            return None


    def searchID_byName(self,cursor,name):

        try:
            cursor.execute(f"SELECT id FROM {self.table} WHERE name = ?",(name,))
            result= cursor.fetchone()
            if result:
                return result[0]
            else:
                return None
        except Exception as e:
            print(f"查询失败：{e}")
            return None
        

    def renew_character_info(self,cursor,conn,name,info):
        try:
            cursor.execute(f"UPDATE {self.table} SET name = ?, age = ?, sex = ?,level = ?,exp = ? WHERE name = ?",(info[0],info[1],info[2],info[3],info[4],name))
            conn.commit()
            print(f"character:角色 {name} 信息更新成功")
            return True
        except Exception as e:
            print(f"character:角色 {name} 信息更新失败：{e}")
            return False


# test=Character_tableManager()
# test.connect()
# test.delete_table("character")
# test.create_table()
# test.get_all_tables()
# test.search("character")


# test.close()

