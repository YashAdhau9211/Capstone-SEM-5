# app/core/config.py

from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# This function reads the .env file from your project's root directory
load_dotenv()

class Settings(BaseSettings):
    """
    This class defines all the settings for our application.
    Pydantic automatically reads these from the environment variables.
    """
    # NOTE: HF_API_KEY has been removed as it is not needed for Ollama.

    # This expects an environment variable named CELERY_BROKER_URL
    CELERY_BROKER_URL: str
    
    # This expects an environment variable named CELERY_RESULT_BACKEND
    CELERY_RESULT_BACKEND: str

    class Config:
        # This tells Pydantic to be case-insensitive when matching
        # environment variables to the settings above.
        case_sensitive = False


# We create one single instance of our Settings.
# The rest of our application will import this `settings` object
# to access any configuration value.
settings = Settings()