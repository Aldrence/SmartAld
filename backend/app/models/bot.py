from sqlalchemy import Column, String, Text, ForeignKey, DateTime
from app.database.db import Base
from sqlalchemy.orm import relationship

class Bot(Base):
    __tablename__ = "bots"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    code = Column(Text)
    upload_id = Column(String, ForeignKey("uploads.id"))
    created_at = Column(DateTime)

    upload = relationship("Upload", back_populates="bot")
