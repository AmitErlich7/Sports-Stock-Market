from sqlalchemy import create_engine, text
import os

try:
    print("Testing DB connection...")
    DATABASE_URL = "sqlite:///./sports_stock.db"
    
    if os.path.exists("./sports_stock.db"):
        print(f"DB file exists at {os.path.abspath('./sports_stock.db')}, size: {os.path.getsize('./sports_stock.db')} bytes")
    else:
        print("DB file NOT found!")

    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print(f"Connection successful! Result: {result.fetchone()}")
except Exception as e:
    print(f"Error connecting to DB: {e}")
