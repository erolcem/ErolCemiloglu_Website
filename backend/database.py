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

# In backend/database.py

def get_db_projects():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM projects ORDER BY id DESC"))
            
            projects = []
            for row in result.mappings():
                row_dict = dict(row)
                
                # --- FIX: Manually clean the tech_stack ---
                tech = row_dict.get('tech_stack')
                
                # If Postgres sent it as a string "{SQL,Supabase}", parse it
                if isinstance(tech, str):
                    # Remove curly braces and quotes
                    clean_str = tech.replace('{', '').replace('}', '').replace('"', '')
                    # Convert to list
                    if clean_str:
                        row_dict['tech_stack'] = [t.strip() for t in clean_str.split(',')]
                    else:
                        row_dict['tech_stack'] = []
                        
                # If it's None, make it an empty list
                elif tech is None:
                    row_dict['tech_stack'] = []
                
                # If it's already a list (which sometimes happens), leave it alone.
                
                projects.append(row_dict)
                
            return projects
    except Exception as e:
        print(f"Database Error: {e}")
        return []