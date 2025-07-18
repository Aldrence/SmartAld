from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes import auth, upload, botgen
from app.database.db import engine, Base
from app.models import user

app = FastAPI(
    title="SmartAldrence API",
    description="AI-powered bot platform for Forex & Crypto",
    version="1.0.0"
)

# ✅ CORS settings
origins = [
    "http://localhost:3000",
    "https://your-vercel-app-url",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Serve static uploads directory at http://localhost:8001/uploads/<filename>
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ✅ Register routes
app.include_router(auth.router, prefix="/api/auth")
app.include_router(upload.router, prefix="/api/upload")
app.include_router(botgen.router, prefix="/api/bots")

@app.get("/")
def root():
    return {"message": "Welcome to SmartAldrence API!"}

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
