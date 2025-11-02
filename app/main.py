from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import recommend

app = FastAPI()
load_dotenv()

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://cross-border-payments.vercel.app",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend.router)

@app.get("/")
def health_check():
    return {"status": "healthy"}


