from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

# --- Request Schemas ---

class GenerationRequest(BaseModel):
    """
    Defines the expected input for the /generate endpoint.
    """
    prompt: str = Field(
        ...,  # The '...' makes this field required.
        description="The natural language prompt from the user.",
        min_length=10,
        max_length=500
    )

# --- Response Schemas ---

class GenerationResponse(BaseModel):
    """
    Defines the response sent immediately after a generation request.
    """
    task_id: str = Field(..., description="The unique ID for the generation task.")


class TaskStatusResponse(BaseModel):
    """
    Defines the response for the /status/{task_id} endpoint.
    """
    task_id: str = Field(..., description="The unique ID of the task.")
    status: str = Field(..., description="The current status of the task (e.g., PENDING, SUCCESS, FAILURE).")
    result: Optional[Any] = Field(None, description="The output of the task if it is complete.")