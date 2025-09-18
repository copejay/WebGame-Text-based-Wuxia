import sqlite3


class SQLiteDBManager:
    def __init__(self):
        self.db_path='./instance/game.db'
        self.conn=None
        self.cursor=None
        self.table=None

    def connect(self):
        try:
            self.conn= sqlite3.connect(self.db_path)
            self.cursor= self.conn.cursor()
            return True
        except sqlite3.Error as e:
            print(f"数据库连接失败：{e}")
            return False
        
    def close(self)->None:
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()
        self.cursor= None

    def get_all_tables(self):
        if not self.cursor:
            print("请先建立数据库连接")
            return []
        try:
            self.cursor.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
                )
            print(self.cursor.fetchall())

            return [table[0] for table in self.cursor.fetchall()]
        except sqlite3.Error as e:
            print(f"获取表名失败：{e}")
            return []
    

class Talk_tableManager(SQLiteDBManager):
    def __init__(self):
        super().__init__()
        self.table='Talk'

    def search_table(self):
        try:
            self.cursor.execute(f"SELECT * FROM {self.table}")
            results= self.cursor.fetchall()
            for row in results:
                print(row)
        except Exception as e:
            print(f"查询失败：{e}")


class Player_tableManager(SQLiteDBManager):
    def __init__(self):
        super().__init__()
        self.table='Player'

    def search_table(self):
        try:
            self.cursor.execute(f"SELECT * FROM {self.table}")
            results= self.cursor.fetchall()
            for row in results:
                print(row)
        except Exception as e:
            print(f"查询失败：{e}")



# talk_table=Talk_tableManager()
# talk_table.connect()
# talk_table.search_table()
# talk_table.close()


talk_manager=SQLiteDBManager()
talk_manager.connect()
talk_manager.get_all_tables()
talk_manager.close()
        
            
