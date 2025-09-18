import sqlite3
import os
from pathlib import Path
from contextlib import contextmanager

# from dotenv import load_dotenv

# load_dotenv()
# db_path=os.getenv("DB_PATH")



class SQLiteDBManager:

    def __init__(self):
        current_dir = Path(__file__).parent  # db_control 文件夹

        # 向上回退 3 级到 game_js 目录，再进入 instance/game.db
        db_path = current_dir.parent.parent.parent / "instance" / "game.db"
        # db_path='C:\Users\hgd\Desktop\game_js\instance\game.db'
        self.db_path=Path(db_path).absolute()

        self.conn=None
        self.cursor=None
        self.table=None

    @contextmanager
    def get_connection(self):
        conn= sqlite3.connect(self.db_path)
        cursor=conn.cursor()
        try:
            yield cursor,conn
            conn.commit()
        except Exception as e:
            conn.rollback()
            print(f"数据库操作失败：{e}")
        finally:
            cursor.close()
            conn.close()


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

    def search(self,table_name):
        try:
            self.cursor.execute(f"SELECT * FROM {table_name}")
            results= self.cursor.fetchall()
            print("表内容查询结果：")
            for row in results:
                print(row)
        except Exception as e:
            print(f"表 {table_name} 内容查询失败：{e}")



    def delete_table(self,table_name):
        try:
            self.cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
            self.conn.commit()
            print(f"表 {table_name} 删除成功")
        except Exception as e:
            print(f"删除表失败：{e}")


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
        
# test=SQLiteDBManager()
# test.connect()
# test.get_all_tables()
