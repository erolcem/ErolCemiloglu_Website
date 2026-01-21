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

# Inside backend/database.py

def get_db_projects():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM projects ORDER BY custom_order DESC, id DESC"))
            
            projects = []
            for row in result.mappings():
                row_dict = dict(row)
                
                # --- FIX: Handle Column Name Mismatch ---
                # Check for "tech_stack" OR "tech stack" (with space)
                raw_tech = row_dict.get('tech_stack') or row_dict.get('tech stack')
                
                # Clean the data using our helper
                row_dict['tech_stack'] = clean_tech_stack(raw_tech)
                
                # Optional: Remove the awkward key with the space to keep JSON clean
                if 'tech stack' in row_dict:
                    del row_dict['tech stack']
                
                projects.append(row_dict)
                
            return projects
    except Exception as e:
        print(f"Database Error: {e}")
        return []
    

def get_db_skills():
    try:
        with engine.connect() as conn:
            # Fetch all skills
            result = conn.execute(text("SELECT * FROM skills ORDER BY id ASC"))
            
            skills = []
            for row in result.mappings():
                # No complex parsing needed anymore!
                # The data structure is already perfect for the grid.
                skills.append(dict(row))
                
            return skills
    except Exception as e:
        print(f"Database Error: {e}")
        return []