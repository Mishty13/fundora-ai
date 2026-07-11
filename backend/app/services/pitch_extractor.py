from io import BytesIO

from pypdf import PdfReader
from pptx import Presentation


MAX_EXTRACTED_TEXT_LENGTH = 100_000


class PitchExtractionError(Exception):
    """Raised when readable text cannot be extracted from a pitch deck."""


def _clean_text(text: str) -> str:
    lines = [
        " ".join(line.split())
        for line in text.splitlines()
        if line.strip()
    ]

    return "\n".join(lines).strip()


def _limit_text(text: str) -> str:
    return text[:MAX_EXTRACTED_TEXT_LENGTH]


def extract_pdf_text(file_bytes: bytes) -> str:
    try:
        reader = PdfReader(BytesIO(file_bytes))

        extracted_pages = []

        for page_number, page in enumerate(
            reader.pages,
            start=1,
        ):
            page_text = _clean_text(page.extract_text() or "")

            if page_text:
                extracted_pages.append(
                    f"[Page {page_number}]\n{page_text}"
                )

        extracted_text = "\n\n".join(extracted_pages)

    except Exception as error:
        raise PitchExtractionError(
            "The PDF could not be read."
        ) from error

    if not extracted_text.strip():
        raise PitchExtractionError(
            "No readable text was found in the PDF."
        )

    return _limit_text(extracted_text)


def extract_pptx_text(file_bytes: bytes) -> str:
    try:
        presentation = Presentation(BytesIO(file_bytes))

        extracted_slides = []

        for slide_number, slide in enumerate(
            presentation.slides,
            start=1,
        ):
            slide_parts = []

            for shape in slide.shapes:
                if hasattr(shape, "text"):
                    shape_text = _clean_text(shape.text or "")

                    if shape_text:
                        slide_parts.append(shape_text)

            if slide_parts:
                extracted_slides.append(
                    f"[Slide {slide_number}]\n"
                    + "\n".join(slide_parts)
                )

        extracted_text = "\n\n".join(extracted_slides)

    except Exception as error:
        raise PitchExtractionError(
            "The PowerPoint file could not be read."
        ) from error

    if not extracted_text.strip():
        raise PitchExtractionError(
            "No readable text was found in the PowerPoint file."
        )

    return _limit_text(extracted_text)


def extract_pitch_text(
    file_bytes: bytes,
    content_type: str,
) -> str:
    if content_type == "application/pdf":
        return extract_pdf_text(file_bytes)

    if (
        content_type
        == "application/vnd.openxmlformats-officedocument."
        "presentationml.presentation"
    ):
        return extract_pptx_text(file_bytes)

    raise PitchExtractionError(
        "Unsupported pitch deck file type."
    )