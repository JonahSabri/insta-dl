from __future__ import annotations

import re
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.api.deps import verify_admin
from app.config import settings

router = APIRouter(tags=["uploads"])

UPLOAD_DIR = Path(settings.DOWNLOADS_DIR) / "uploads"
ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
MAX_BYTES = 5 * 1024 * 1024


def _safe_name(original: str) -> str:
    ext = Path(original).suffix.lower()
    if ext not in ALLOWED_EXT:
        ext = ".png"
    return f"{uuid.uuid4().hex}{ext}"


@router.post("/admin/upload")
async def admin_upload(
    file: UploadFile = File(...),
    _: str = Depends(verify_admin),
) -> dict:
    if not file.filename:
        raise HTTPException(status_code=400, detail="فایل انتخاب نشده.")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(status_code=400, detail="فرمت تصویر مجاز نیست.")

    content = await file.read()
    if len(content) > MAX_BYTES:
        raise HTTPException(status_code=400, detail="حداکثر حجم تصویر ۵ مگابایت است.")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    name = _safe_name(file.filename)
    path = UPLOAD_DIR / name
    path.write_bytes(content)
    return {
        "url": f"/api/v1/uploads/{name}",
        "filename": name,
        "size": len(content),
    }


@router.get("/v1/uploads/{filename}")
async def get_upload(filename: str) -> FileResponse:
    if not re.fullmatch(r"[a-f0-9]+\.(jpg|jpeg|png|gif|webp|svg)", filename, re.I):
        raise HTTPException(status_code=400, detail="نام فایل نامعتبر است.")
    path = UPLOAD_DIR / filename
    if not path.is_file():
        raise HTTPException(status_code=404, detail="فایل یافت نشد.")
    return FileResponse(path)
