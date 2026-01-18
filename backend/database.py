import os
import json # <--- Added this to handle JSON strings
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

def clean_tech_stack(raw_data):
    """
    The 'God Mode' parser. 
    Converts literally any format (Postgres string, JSON string, List, None) 
    into a clean Python List.
    """
    # Case 1: It's empty
    if raw_data is None:
        return []

    # Case 2: It's already a List (Perfect!)
    if isinstance(raw_data, list):
        return raw_data

    # Case 3: It's a String
    if isinstance(raw_data, str):
        raw_data = raw_data.strip()
        
        # Sub-case A: Postgres Array format "{SQL, Python}"
        if raw_data.startswith('{') and raw_data.endswith('}'):
            # Strip braces and quotes
            cleaned = raw_data.strip('{}').replace('"', '')
            return [t.strip() for t in cleaned.split(',') if t.strip()]
        
        # Sub-case B: JSON Array format "["SQL", "Python"]"
        # (This happens if you pasted data directly into Supabase UI)
        elif raw_data.startswith('[') and raw_data.endswith(']'):
            try:
                return json.loads(raw_data)
            except:
                return []
                
        # Sub-case C: Just commas "SQL, Python"
        else:
            return [t.strip() for t in raw_data.split(',') if t.strip()]

    return []

def get_db_projects():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM projects ORDER BY id DESC"))
            
            projects = []
            for row in result.mappings():
                # Convert the database row to a mutable dictionary
                row_dict = dict(row)
                
                # --- APPLY THE CLEANER ---
                # We overwrite the raw data with our clean list
                row_dict['tech_stack'] = clean_tech_stack(row_dict.get('tech_stack'))
                
                projects.append(row_dict)
                
            return projects
    except Exception as e:
        print(f"Database Error: {e}")
        return []