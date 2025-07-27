# app/main.py

from fastapi import FastAPI
from app.api.v1 import endpoints as v1_endpoints

# Create an instance of the FastAPI class.
# This 'app' object will be our main point of interaction.
app = FastAPI(
    title="Prompt2Figma Backend",
    description="The backend service for the Prompt2Figma plugin, handling AI generation tasks.",
    version="1.0.0",
)

@app.get("/")
def read_root():
    """
    This is the root endpoint of our API.
    It's a simple way to check if the server is running correctly.
    You can think of it as a "health check".
    """
    return {"status": "ok", "message": "Welcome to the Prompt2Figma Backend!"}

# In the future, we will connect our API routes here.
# For example: app.include_router(api_router, prefix="/api/v1")

app.include_router(v1_endpoints.router, prefix="/api/v1")