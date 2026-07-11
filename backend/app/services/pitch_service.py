from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

from app.core.supabase import supabase_admin
from app.services.pitch_extractor import (
    PitchExtractionError,
    extract_pitch_text,
)


PITCH_BUCKET = "pitch-decks"

MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024

ALLOWED_CONTENT_TYPES = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
}


class PitchService:
    @staticmethod
    def _load_founder_startup(
        founder_id: str,
    ) -> dict[str, Any]:
        try:
            response = (
                supabase_admin.table("startups")
                .select("*")
                .eq("founder_id", founder_id)
                .limit(1)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to load startup data.",
            ) from error

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "No startup profile was found for the "
                    "authenticated founder."
                ),
            )

        return response.data[0]

    @staticmethod
    async def create_upload(
        founder_id: str,
        file: UploadFile,
    ) -> dict[str, Any]:
        startup = PitchService._load_founder_startup(
            founder_id
        )

        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded file must have a name.",
            )

        expected_extension = ALLOWED_CONTENT_TYPES.get(
            file.content_type or ""
        )

        if expected_extension is None:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=(
                    "Only PDF and PPTX pitch decks are supported."
                ),
            )

        actual_extension = Path(file.filename).suffix.lower()

        if actual_extension != expected_extension:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "The file extension does not match its "
                    "declared content type."
                ),
            )

        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded file is empty.",
            )

        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Pitch decks must not exceed 20 MB.",
            )

        try:
            extracted_text = extract_pitch_text(
                file_bytes=file_bytes,
                content_type=file.content_type or "",
            )
        except PitchExtractionError as error:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(error),
            ) from error

        safe_file_name = f"{uuid4()}{expected_extension}"

        file_path = (
            f"{founder_id}/{startup['id']}/{safe_file_name}"
        )

        try:
            supabase_admin.storage.from_(PITCH_BUCKET).upload(
                path=file_path,
                file=file_bytes,
                file_options={
                    "content-type": file.content_type,
                    "upsert": "false",
                },
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to store the pitch deck.",
            ) from error

        analysis_payload = {
            "startup_id": startup["id"],
            "founder_id": founder_id,
            "file_name": file.filename,
            "file_path": file_path,
            "file_type": file.content_type,
            "file_size_bytes": len(file_bytes),
            "extraction_status": "completed",
            "analysis_status": "pending",
            "extracted_text": extracted_text,
        }

        try:
            response = (
                supabase_admin.table("pitch_analyses")
                .insert(analysis_payload)
                .execute()
            )
        except Exception as error:
            try:
                supabase_admin.storage.from_(
                    PITCH_BUCKET
                ).remove([file_path])
            except Exception:
                pass

            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "The pitch deck was uploaded, but its "
                    "analysis record could not be created."
                ),
            ) from error

        if not response.data:
            try:
                supabase_admin.storage.from_(
                    PITCH_BUCKET
                ).remove([file_path])
            except Exception:
                pass

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=(
                    "The pitch upload record could not be returned."
                ),
            )

        return response.data[0]

    @staticmethod
    def get_latest_analysis(
        founder_id: str,
    ) -> dict[str, Any] | None:
        try:
            response = (
                supabase_admin.table("pitch_analyses")
                .select("*")
                .eq("founder_id", founder_id)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "Unable to load the latest pitch analysis."
                ),
            ) from error

        if not response.data:
            return None

        return response.data[0]


pitch_service = PitchService()