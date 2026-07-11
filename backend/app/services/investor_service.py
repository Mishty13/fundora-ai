from typing import Any

from fastapi import HTTPException, status

from app.core.supabase import supabase_admin
from app.schemas.investor import InvestorProfileUpsert


class InvestorService:
    @staticmethod
    def get_profile(
        user_id: str,
    ) -> dict[str, Any] | None:
        try:
            response = (
                supabase_admin
                .table("investor_profiles")
                .select("*")
                .eq("user_id", user_id)
                .limit(1)
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to load the investor profile.",
            ) from error

        if not response.data:
            return None

        return response.data[0]

    @staticmethod
    def upsert_profile(
        user_id: str,
        profile_data: InvestorProfileUpsert,
    ) -> dict[str, Any]:
        payload = profile_data.model_dump()

        payload["user_id"] = user_id

        payload["is_profile_complete"] = bool(
            payload["investor_name"]
            and payload["investor_type"]
            and payload["preferred_stages"]
            and payload["preferred_sectors"]
            and payload["preferred_geographies"]
            and payload["minimum_cheque_size"] is not None
            and payload["maximum_cheque_size"] is not None
        )

        try:
            response = (
                supabase_admin
                .table("investor_profiles")
                .upsert(
                    payload,
                    on_conflict="user_id",
                )
                .execute()
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to save the investor profile.",
            ) from error

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=(
                    "The saved investor profile could not "
                    "be returned."
                ),
            )

        return response.data[0]


investor_service = InvestorService()