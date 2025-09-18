

from db_main import SQLiteDBManager

class Talk_tableManager(SQLiteDBManager):
    def __init__(self):
        super().__init__()
        self.table_name='Talk'

    def create_table(self):
        self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {self.table_name} (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, message TEXT, time INTEGER )")
        self.conn.commit()

    
    def input_message(self,cursor,conn,name,message,time):
        cursor.execute(f"INSERT INTO {self.table_name} (name,message,time) VALUES (?,?,?)",(name,message,time))
        print("Talk:输入成功")

        conn.commit()


    def delete_message(self,name):
        self.cursor.execute(f"DELETE FROM {self.table_name} WHERE name=?",(name,))
        self.conn.commit()


    def search_table_data(self,cursor):
        try:
            cursor.execute(f"SELECT * FROM {self.table_name}")
            results= cursor.fetchall()
            data_list=[]
            for row in results:
                # print(row)
                data_list.append(row)
            print(data_list)
            return data_list

        except Exception as e:
            print(f"查询失败：{e}")

    
# test=Talk_tableManager()
# test.connect()
# # test.input_message("hgd","你好",404)

# # test.search("Talk")
# # a=test.search_table()
# # print(a[0][1])

# # test.create_table()

# test.close()
