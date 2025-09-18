

from db_main import SQLiteDBManager

class Magic_tableManager(SQLiteDBManager):
    def __init__(self):
        super().__init__()
        self.table_name="magic"

    def create_table(self):
        self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {self.table_name} (id TEXT PRIMARY KEY , name TEXT UNIQUE, describe TEXT,type TEXT, blood INTEGER , magic INTEGER, spirit INTEGER)")
        self.conn.commit()


    def insert_magic(self,id,name,describe,type,blood,magic,spirit):
        self.cursor.execute(f"INSERT INTO {self.table_name} (id,name,describe,type,blood,magic,spirit) VALUES (?,?,?,?,?,?,?)", (id,name,describe,type,blood,magic,spirit))
        self.conn.commit()
        print(f"magic:插入{name}成功")
        

    def search_magic_byName(self,cursor,name):
        cursor.execute(f"SELECT * FROM {self.table_name} WHERE name = ?",(name,))
        result= cursor.fetchone()
        if result:
            print(f"magic:根据{name} 成功找到信息")
            return result
        else:
            print(f"magic:根据{name} 未找到信息")
            return False




        