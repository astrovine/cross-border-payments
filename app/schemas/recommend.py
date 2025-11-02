from pydantic import BaseModel

class ToRecommend(BaseModel):
    amount: float
    source_currency: str
    dest_currency: str
    priority: str = 'cost'