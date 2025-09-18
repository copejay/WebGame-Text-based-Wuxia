

from db_main import SQLiteDBManager


class lowNPC_tableManager(SQLiteDBManager):
    def __init__(self):
        super().__init__()
        self.table_name="lowNPC"


    def create_table(self):
        self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {self.table_name} (id INTEGER PRIMARY KEY, name TEXT UNIQUE,describe TEXT, hp INTEGER, atc INTEGER, def INTEGER, speed INTEGER)")

        self.conn.commit()

    
    def create_npc(self,id,name,describe,hp,atc,def_,speed):
        self.cursor.execute(f"INSERT INTO {self.table_name} (id,name,describe,hp,atc,def,speed) VALUES (?,?,?,?,?,?,?)",(id,name,describe,hp,atc,def_,speed))
        self.conn.commit()


    def search_npc(self,cursor,name):
        cursor.execute(f"SELECT * FROM {self.table_name} WHERE name=?",(name,))
        return cursor.fetchone()



    def delete_npc(self,name):
        self.cursor.execute(f"DELETE FROM {self.table_name} WHERE name=?",(name,))
        self.conn.commit()

# test=lowNPC_tableManager()

# test.connect()
# # test.delete_table("lowNPC")

# # test.create_table()
# # test.search("lowNPC")

# test.close()

