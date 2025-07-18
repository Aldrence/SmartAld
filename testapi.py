from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to http://localhost:3000 later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schema
class RegisterUser(BaseModel):
    email: str
    username: str
    password: str

# Register route
@app.post("/api/auth/register")
async def register(user: RegisterUser):
    # Placeholder logic
    return {"message": "User registered successfully", "user": user}
