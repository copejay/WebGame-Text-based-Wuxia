
from db_main import SQLiteDBManager

class Player_tableManager(SQLiteDBManager):
    def __init__(self):
        super().__init__()
        self.table='Player'


    def create_table(self):
        try:
            self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {self.table} (account TEXT PRIMARY KEY, password TEXT, character_id TEXT NULL)")

            self.conn.commit()
            print(f"表 {self.table} 创建成功")
        except Exception as e:
            print(f"创建表失败：{e}")


    def create_player(self,cursor,conn,account,password,character_id=None):
        try:
            cursor.execute(f"INSERT INTO {self.table} (account, password, character_id) VALUES (?, ?, ?)",(account, password, character_id))
            conn.commit()
            print(f"player:账号 {account} 创建成功")
            return True

        except Exception as e:
            print(f"player:创建账号失败：{e}")
            return False



    def login_check(self,cursor,account,password):
        try:
            cursor.execute(f"SELECT * FROM {self.table} WHERE account = ? AND password = ?",(account, password))
            result= cursor.fetchone()
            if result!=None:
                print(f"player:账号 {account} 存在")
                return True
            else:
                print(f"player:账号 {account} 不存在")
                return False
        except Exception as e:
            print(f"player:查询失败：{e}")
            return False
        

    # def searchID_byName(self,name):
    #     try:
    #         self.cursor.execute(f"SELECT id FROM {self.table} WHERE name = ?",(name,))
    #         result= self.cursor.fetchone()
    #         if result:
    #             return result[0]
    #         else:
    #             return None
    #     except Exception as e:
    #         print(f"查询失败：{e}")
    #         return None

    def searchID_byAccount(self,cursor,account):
        try:
            # print(f"player:开始通过账号查询角色id")

            cursor.execute(f"SELECT character_id FROM {self.table} WHERE account = ?",(account,))
            result= cursor.fetchone()
            if result[0]!=None:
                # print(f"player:根据{account} 成功找到{result}")
                return result[0]
            else:
                print(f"player:根据{account} 未找到id")
                return False
        except Exception as e:
            print(f"player:查询失败：{e}")
            return False



    def player_add_character(self,cursor,conn,account,character_id):
        try:
            cursor.execute(f"SELECT account FROM {self.table} WHERE account = ? AND character_id IS NULL",(account,))
            result=cursor.fetchone()

            if result:
                cursor.execute(f"UPDATE {self.table} SET character_id = ? WHERE account = ?",(character_id, account))
                conn.commit()
                print(f"player:账号 {account} 绑定角色 {character_id} 成功")
                return True
            else:
                print(f"player:账号 {account} 已绑定角色")
                return False

        except Exception as e:
            print(f"player:创建角色失败：{e}")
            return False



    def search(self):
        try:
            self.cursor.execute(f"SELECT * FROM {self.table}")
            results= self.cursor.fetchall()
            for row in results:
                print(row)
        except Exception as e:
            print(f"查询失败：{e}")

# test=Player_tableManager()
# test.connect()

# test.delete_table("Player")

# test.create_table()

# test.search()
# test.close()
