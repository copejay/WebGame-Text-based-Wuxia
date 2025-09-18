

from db_main import SQLiteDBManager

class bagMagic_tableManager(SQLiteDBManager):
    def __init__(self):
        super().__init__()
        self.table_name="bagMagic"

    def create_table(self):
        self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {self.table_name} (character_id INTEGER , equip TEXT, level INTEGER, magic_id TEXT, magic_name TEXT, PRIMARY KEY(character_id,magic_id),FOREIGN KEY(character_id) REFERENCES character(id) ON DELETE CASCADE, FOREIGN KEY(magic_id) REFERENCES magic(id))")
        self.conn.commit()
        #sqlite默认外键约束关闭，需要手动开启，先写着，后面再优化


    def insert_bagMagic(self,cursor,conn,character_id,equip,level,magic_id,magic_name):
        try:
            cursor.execute(f"INSERT INTO {self.table_name} (character_id,equip,level,magic_id,magic_name) VALUES (?,?,?,?,?)", (character_id,equip,level,magic_id,magic_name))
            conn.commit()
            print(f"bagMagic:插入{magic_name}成功")
            return True
        except:
            print(f"bagMagic:插入{magic_name}失败")
            return False
    
    def updata_level(self,cursor,conn,character_id,magic_id,level):
        cursor.execute(f"UPDATE {self.table_name} SET level = ? WHERE character_id = ? AND magic_id = ?", (level,character_id,magic_id))
        conn.commit()
        print(f"bagMagic:更新{character_id}的{magic_id}的level成功")
        return True
    
    def updata_equip(self,cursor,conn,character_id,magic_id,equip):
        cursor.execute(f"UPDATE {self.table_name} SET equip = ? WHERE character_id = ? AND magic_id = ?", (equip,character_id,magic_id))
        conn.commit()
        print(f"bagMagic:更新{character_id}的{magic_id}的equip成功")
        return True
    
    def delete_magic(self,cursor,conn,character_id,magic_id):
        cursor.execute(f"DELETE FROM {self.table_name} WHERE character_id = ? AND magic_id = ?", (character_id,magic_id))
        conn.commit()
        print(f"bagMagic:删除{character_id}的{magic_id}成功")
        return True
    
    # def update_Magic()
    
    def search_bagMagic_byId(self,cursor,character_id):
        cursor.execute(f"SELECT * FROM {self.table_name} WHERE character_id = ?",(character_id,))
        return cursor.fetchall()
    

# test=bagMagic_tableManager()
# test.connect()

# test.delete_table("bagMagic")
# test.create_table()

# # test.insert_bagMagic(1,"yes","a1","降龙十八掌")
# # test.insert_bagMagic(1,"yes","a2","降龙十掌")
# # test.insert_bagMagic(1,"yes","a5","降龙掌")
# # test.updata_equip(1,"a1","no")
# # test.delete_magic(1,"n1")

# # # test.create_item("2","Gu_aiqing","爱情仙蛊","武器",1)
# # # test.update_item("1","1",1)
# test.close()