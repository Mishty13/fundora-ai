from abc import ABC, abstractmethod

from app.schemas.pitch import GranitePitchAnalysis


class PitchAnalysisProvider(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        raise NotImplementedError

    @property
    @abstractmethod
    def model_name(self) -> str:
        raise NotImplementedError

    @abstractmethod
    async def analyze(
        self,
        extracted_text: str,
        startup_context: dict,
    ) -> GranitePitchAnalysis:
        raise NotImplementedError