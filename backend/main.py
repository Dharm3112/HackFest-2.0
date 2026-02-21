from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import init_db
from backend.api import rules

app = FastAPI(title="OmniGuard AML API")

# Setup CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite database
init_db()

# Include Routers
app.include_router(rules.router)

@app.get("/")
def read_root():
    return {"status": "OmniGuard AML API is running", "hexacore_status": "Online"}
