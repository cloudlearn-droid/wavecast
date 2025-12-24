import os
import psycopg2
from dotenv import load_dotenv

# Load .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


def test_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        cur.execute("SELECT 1;")
        result = cur.fetchone()

        print("✅ DB Connected. Result:", result)

        cur.close()
        conn.close()

    except Exception as e:
        print("❌ DB Connection Failed")
        print(e)


if __name__ == "__main__":
    test_connection()
