from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from app.database.config import settings  # Make sure settings.DATABASE_URL is valid

# ⚠️ Alembic needs a sync DB URL. So for Alembic migrations, you’ll use a different file or sync engine setup.

# DATABASE_URL should be like: "sqlite+aiosqlite:///./test.db" or PostgreSQL URL like "postgresql+asyncpg://user:pass@localhost/db"
DATABASE_URL = settings.DATABASE_URL

# Async engine for runtime
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# Async sessionmaker
SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Declarative base for models
Base = declarative_base()

# Dependency to use inside FastAPI routes
@asynccontextmanager
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session

# Makes sure Alembic and external imports work
__all__ = ["Base", "engine", "SessionLocal", "get_db"]
