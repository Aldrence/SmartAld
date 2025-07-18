from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional
import shutil, os, uuid

from app.database.db import get_db
from app.models.upload import Upload
from app.routes.auth import get_current_user
from app.models.bot import Bot
from datetime import datetime

router = APIRouter(tags=["Uploads"])

# Ensure upload directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ✅ Upload file or link
@router.post("/upload")
async def upload_file(
    type: str = Form(...),
    description: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    link: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if type not in ["pdf", "video", "image"]:
        raise HTTPException(status_code=400, detail="Invalid file type")

    resource_id = str(uuid.uuid4())
    filename = None

    if file:
        filename = f"{resource_id}_{file.filename}"
        with open(os.path.join(UPLOAD_DIR, filename), "wb") as buf:
            shutil.copyfileobj(file.file, buf)
    elif not link:
        raise HTTPException(status_code=400, detail="No file or link provided")

    upload = Upload(
        id=resource_id,
        filename=filename,
        type=type,
        link=link,
        description=description,
        uploaded_at=datetime.utcnow(),
        user_id=current_user["id"]
    )

    db.add(upload)
    await db.commit()

    return {"message": "✅ Upload saved", "id": resource_id}


# ✅ List uploads by logged-in user
@router.get("/uploads")
async def list_uploads(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    result = await db.execute(
        select(Upload).where(Upload.user_id == current_user["id"])
    )
    uploads = result.scalars().all()

    return [
        {
            "id": u.id,
            "filename": u.filename,
            "type": u.type,
            "link": u.link,
            "description": u.description,
            "uploadedAt": u.uploaded_at.isoformat() if u.uploaded_at else None,
            "previewUrl": f"/uploads/{u.filename}" if u.filename else u.link
        }
        for u in uploads
    ]


# ✅ Delete file + DB record
@router.delete("/uploads/{upload_id}")
async def delete_upload(
    upload_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    result = await db.execute(
        select(Upload).where(Upload.id == upload_id, Upload.user_id == current_user["id"])
    )
    upload = result.scalar_one_or_none()

    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

    if upload.filename:
        filepath = os.path.join(UPLOAD_DIR, upload.filename)
        if os.path.exists(filepath):
            os.remove(filepath)

    await db.delete(upload)
    await db.commit()

    return {"message": "✅ Upload deleted"}


# ✅ Generate Bot
@router.post("/generate-bot/{upload_id}")
async def generate_bot(
    upload_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    result = await db.execute(
        select(Upload).where(Upload.id == upload_id, Upload.user_id == current_user["id"])
    )
    upload = result.scalar_one_or_none()

    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

    resource_name = upload.filename or upload.link or "Unnamed"
    generated_code = f"# Auto-generated bot from {resource_name}\nprint('Hello from SmartAldrence Bot')"

    bot = Bot(
        id=str(uuid.uuid4()),
        name=f"Bot from {resource_name}",
        code=generated_code,
        upload_id=upload.id,
        created_at=datetime.utcnow()
    )

    db.add(bot)
    await db.commit()

    return {"message": "🤖 Bot generated!", "botId": bot.id}
