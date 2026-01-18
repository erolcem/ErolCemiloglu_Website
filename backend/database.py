import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# 1. Load environment variables (gets your password from .env)
load_dotenv()

# 2. Get the connection string
DATABASE_URL = os.getenv("DATABASE_URL")

# Compatibility Fix: Render/Supabase sometimes give "postgres://", 
# but SQLAlchemy needs "postgresql://"
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. Create the Connection Engine
# This 'engine' is the actual open line to Supabase
engine = create_engine(DATABASE_URL)

def get_db_projects():
    """
    Connects to the database, selects all rows from 'projects', 
    and returns them as a clean list of dictionaries.
    """
    try:
        with engine.connect() as conn:
            # Execute raw SQL
            result = conn.execute(text("SELECT * FROM projects ORDER BY id DESC"))
            
            # Convert the database rows into a Python List
            projects = []
            for row in result.mappings():
                projects.append(dict(row))
                
            return projects
    except Exception as e:
        print(f"Database Error: {e}")
        return []