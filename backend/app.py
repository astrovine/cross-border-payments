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
def get_recommendation(amount: float, dest_currency: str, priority: str = 'cost'):
    # 1. Fetch exchange rates using the new function
    exchange_rates = get_exchange_rates(dest_currency)
    if not exchange_rates or not exchange_rates.get(dest_currency):
        raise HTTPException(status_code=500, detail="Could not retrieve exchange rates.")

    # 2. Get recommendation
    result = recommend_provider(df, amount, exchange_rates, dest_currency, priority)
    if result is None:
        raise HTTPException(status_code=404, detail="No provider found for the given currency.")

    return result
