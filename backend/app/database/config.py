from pydantic_settings import BaseSettings  # Updated for Pydantic v2

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    OPENAI_API_KEY: str
    CLOUDINARY_URL: str

    class Config:
        env_file = ".env"

settings = Settings()
