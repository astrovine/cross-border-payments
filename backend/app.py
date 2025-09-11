from fastapi import FastAPI, HTTPException
import pandas as pd
from opt import recommend_provider
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load dataset once at startup
df = pd.read_csv('dataset/payment.csv')

@app.get("/")
def read_root():
    return {"message": "Cross-Border Payments API is running!", "status": "healthy"}

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

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
