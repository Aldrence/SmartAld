from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
import random

from app.database.config import settings
from app.database.db import get_db
from app.models.bot import Bot

router = APIRouter(tags=["Bot Generator"])

# Auth setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return {"id": user_id}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ✅ Existing placeholder endpoint
@router.post("/")
def generate_bot():
    return {"message": "Bot generation coming soon!"}

# ✅ Auth test route
@router.get("/secure-test")
def protected_route(current_user: dict = Depends(get_current_user)):
    return {"message": f"Hello User {current_user['id']}, you’re authorized."}

# ✅ NEW: Performance data endpoint
@router.get("/performance")
async def get_bot_performance(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    result = await db.execute(select(Bot).where(Bot.created_by == current_user["id"]))
    bots = result.scalars().all()

    performance_data = []
    for bot in bots:
        performance_data.append({
            "id": bot.id,
            "name": bot.name,
            "status": "Active" if random.random() > 0.2 else "Inactive",
            "accuracy": {
                "daily": random.randint(85, 100),
                "weekly": random.randint(80, 98),
                "monthly": random.randint(75, 95)
            },
            "winLossRatio": f"{random.randint(10, 30)}:{random.randint(0, 5)}",
            "lastUpdated": datetime.utcnow().isoformat()
        })

    return performance_data
