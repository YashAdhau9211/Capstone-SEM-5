from fastapi import APIRouter
from celery.result import AsyncResult
from app.core.services.orchestrator import start_generation_pipeline
from .schemas import GenerationRequest, GenerationResponse, TaskStatusResponse

router = APIRouter()

@router.post("/generate", response_model=GenerationResponse, status_code=202)
def generate_code(request: GenerationRequest):
    """
    Accepts a user prompt and starts the generation pipeline.
    """
    # Call our orchestrator to start the Celery chain.
    task_result = start_generation_pipeline(prompt=request.prompt)
    
    # Return the unique ID of the task chain.
    return {"task_id": task_result.id}


@router.get("/status/{task_id}", response_model=TaskStatusResponse)
def get_task_status(task_id: str):
    """
    Retrieves the status and result of a background task using its ID.
    """
    # Use the task_id to get the result object from Celery's backend (Redis).
    task_result = AsyncResult(id=task_id)
    
    response_data = {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result if task_result.ready() else None,
    }
    
    return response_data