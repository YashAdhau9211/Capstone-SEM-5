from celery import chain
from app.tasks.pipeline import (
    generate_wireframe_json,
    generate_react_code,
    validate_code_ast
)

def start_generation_pipeline(prompt: str):
    """
    Constructs and starts the Celery task chain for code generation.

    The chain ensures tasks run in a specific order:
    1. generate_wireframe_json
    2. generate_react_code
    3. validate_code_ast

    Args:
        prompt: The user's natural language prompt.

    Returns:
        An AsyncResult object which contains the task_id of the chain.
    """

    # chain() links tasks together. The output of one task becomes the input of the next.
    # The '.s()' signature creates a task instance that can be included in a workflow.
    workflow_chain = chain(
        generate_wireframe_json.s(prompt=prompt),
        generate_react_code.s(),
        validate_code_ast.s()
    )

    # apply_async() executes the chain and returns an AsyncResult object immediately.
    result = workflow_chain.apply_async()
    
    return result