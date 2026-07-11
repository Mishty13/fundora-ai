from io import BytesIO

import pytest
from pptx import Presentation

from app.services.pitch_extractor import (
    PitchExtractionError,
    extract_pitch_text,
)


def create_test_pptx() -> bytes:
    presentation = Presentation()

    slide = presentation.slides.add_slide(
        presentation.slide_layouts[1]
    )

    slide.shapes.title.text = "Fundora AI"

    slide.placeholders[1].text = (
        "AI-powered funding intelligence for startups."
    )

    output = BytesIO()
    presentation.save(output)

    return output.getvalue()


def test_extracts_text_from_pptx():
    file_bytes = create_test_pptx()

    extracted_text = extract_pitch_text(
        file_bytes=file_bytes,
        content_type=(
            "application/vnd.openxmlformats-officedocument."
            "presentationml.presentation"
        ),
    )

    assert "[Slide 1]" in extracted_text
    assert "Fundora AI" in extracted_text
    assert (
        "AI-powered funding intelligence for startups."
        in extracted_text
    )


def test_rejects_unsupported_file_type():
    with pytest.raises(
        PitchExtractionError,
        match="Unsupported pitch deck file type.",
    ):
        extract_pitch_text(
            file_bytes=b"example",
            content_type="text/plain",
        )