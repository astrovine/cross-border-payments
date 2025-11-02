import os
from fastapi import HTTPException, APIRouter, status, Query
from ..services import csv, opt
from dotenv import load_dotenv
load_dotenv()
router = APIRouter(prefix="/api/v1")
data = csv.load_csv_data()
API_KEY = os.getenv('API_KEY')

@router.get("/recommend", status_code=status.HTTP_200_OK)
async def get_recommendation(
    amount: float = Query(..., description="Amount to send"),
    source_currency: str = Query(..., description="Source currency code"),
    dest_currency: str = Query(..., description="Destination currency code"),
    priority: str = Query('cost', description="'cost' or 'speed'")
):
    try:
        result = opt.recommend_provider(data, amount, source_currency, dest_currency, priority)
        if result is None:
            raise HTTPException(status_code=404, detail="No provider found for the given currencies.")

        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

