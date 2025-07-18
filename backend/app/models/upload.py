from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import Base

class Upload(Base):
    __tablename__ = "uploads"

    id = Column(String, primary_key=True, index=True)
    filename = Column(String, nullable=True)
    link = Column(String, nullable=True)
    type = Column(String, nullable=False)
    description = Column(String, nullable=True)
    uploaded_at = Column(DateTime)
    user_id = Column(String, ForeignKey("users.id"))

    user = relationship("User", back_populates="uploads")
    bot = relationship("Bot", uselist=False, back_populates="upload")
