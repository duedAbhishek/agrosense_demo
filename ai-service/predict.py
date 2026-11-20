from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class SoilInput(BaseModel):
    moisture: float
    temperature: float
    rainfall_forecast_mm: float

@app.post("/predict-irrigation")
def predict_irrigation(data: SoilInput):
    # Replace with trained Scikit-learn model.predict()
    needs_water = data.moisture < 30 and data.rainfall_forecast_mm < 5.0
    return {
        "irrigate": needs_water,
        "recommended_liters": 15.0 if needs_water else 0.0
    }