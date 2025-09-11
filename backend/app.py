from fastapi import FastAPI, HTTPException
import pandas as pd
from opt import recommend_provider, get_exchange_rates # Import new function
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load dataset once at startup
df = pd.read_csv('C:/Code/Python/border-opt/dataset/payment.csv')

@app.get("/recommend")
def get_recommendation(amount: float, source_currency: str, dest_currency: str, priority: str = 'cost'):
    # Get recommendation with source and destination currencies
    result = recommend_provider(df, amount, source_currency, dest_currency, priority)
    if result is None:
        raise HTTPException(status_code=404, detail="No provider found for the given currencies.")

    # Check if there's an error in the result
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result
