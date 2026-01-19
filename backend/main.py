from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Import BOTH database functions
from database import get_db_projects, get_db_skills 

app = FastAPI()

# Allow the frontend to talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Erol's API is Live 🚀"}

@app.get("/api/projects")
def get_projects():
    # Fetch real data from Supabase Projects table
    return get_db_projects()

@app.get("/api/skills")
def get_skills():
    # Fetch real data from Supabase Skills table (The Bento Grid)
    return get_db_skills()