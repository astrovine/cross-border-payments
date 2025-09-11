from fastapi import FastAPI, HTTPException
import pandas as pd
from opt import recommend_provider
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://*.vercel.app",
    "https://*.railway.app",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

df = pd.read_csv('dataset/payment.csv')

@app.get("/")
def health_check():
    return {"status": "healthy", "message": "Cross-Border Payments API is running"}

@app.get("/recommend")
def get_recommendation(amount: float, source_currency: str, dest_currency: str, priority: str = 'cost'):
    result = recommend_provider(df, amount, source_currency, dest_currency, priority)
    if result is None:
        raise HTTPException(status_code=404, detail="No provider found for the given currencies.")

    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
