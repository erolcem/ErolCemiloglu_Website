from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import get_db_projects

app = FastAPI()

# --- CORS SETTINGS ---
# This tells the backend: "It's okay if requests come from anywhere"
origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FAKE DATABASE (In-Memory) ---
# Later, we will move this to a real PostgreSQL database.
skill_data = {
    "featured": {
        "title": "Robotics & Control",
        "desc": "Specialized in autonomous systems and human-robot collaboration.",
        "tags": ["ROS 2", "Computer Vision", "Path Planning"]
    },
    "stack": [
        {"name": "Python", "level": "Native", "color": "text-green-500"},
        {"name": "C++", "level": "Proficient", "color": "text-yellow-500"},
        {"name": "React/Next.js", "level": "Learning", "color": "text-blue-500"},
        {"name": "Linux", "level": "Advanced", "color": "text-purple-500"},
    ],
    "hardware": ["GPU Servers", "3D Printers", "CNC", "Xsens Mocap"],
    "languages": ["🇬🇧 English (Native)", "🇹🇷 Turkish (Fluent)", "🇯🇵 Japanese (Learning)", "🇰🇭 Khmer (Learning)"]
}


'''
# --- PROJECT DATA ---
project_data = [
    {
        "id": 1,
        "title": "AR4 Robot Arm & Computer Vision",
        "category": "Robotics",
        "date": "2025",
        "description": "Designed and programmed a 6-DOF robotic arm capable of object detection and sorting. Implemented inverse kinematics and YOLOv8 for real-time vision processing.",
        "tech": ["Python", "ROS 2", "OpenCV", "Arduino"],
        "link": "https://github.com/yourname/ar4-robot", # Placeholder
        "image": "video" # We will use this flag to show a video placeholder
    },
    {
        "id": 2,
        "title": "ErolCemiloglu.com (Portfolio)",
        "category": "Full Stack Web",
        "date": "2026",
        "description": "A scalable full-stack personal platform built from scratch. Features a FastAPI Python backend, Next.js frontend, and automated CI/CD pipelines.",
        "tech": ["Next.js", "React", "FastAPI", "Tailwind CSS"],
        "link": "https://github.com/yourname/website",
        "image": "code"
    },
    {
        "id": 3,
        "title": "Robot Trust Analysis Experiment",
        "category": "Research",
        "date": "2025",
        "description": "Conducted human-robot interaction experiments analyzing motion capture data (Xsens) to quantify trust levels in collaborative tasks.",
        "tech": ["Python", "Pandas", "Matplotlib", "Data Analysis"],
        "link": "#",
        "image": "/TrustProject.png"
    }
]
'''

@app.get("/api/projects")
def get_projects():
    # Fetch real data from the database
    return get_db_projects()

@app.get("/")
def read_root():
    return {"Status": "Operational"}

@app.get("/api/skills")
def get_skills():
    return skill_data

# --- DATA MODELS ---
class ContactMessage(BaseModel):
    name: str
    email: str
    message: str