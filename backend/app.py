from fastapi import FastAPI, HTTPException
import csv
from opt import recommend_provider
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://cross-border-payments.vercel.app",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_csv_data():
    """Load CSV data into a list of dictionaries"""
    data = []
    with open('dataset/payment.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row)
    return data

data = load_csv_data()

@app.get("/")
def health_check():
    return {"status": "healthy", "message": "Cross-Border Payments API is running"}

@app.get("/recommend")
def get_recommendation(amount: float, source_currency: str, dest_currency: str, priority: str = 'cost'):
    result = recommend_provider(data, amount, source_currency, dest_currency, priority)
    if result is None:
        raise HTTPException(status_code=404, detail="No provider found for the given currencies.")

    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
