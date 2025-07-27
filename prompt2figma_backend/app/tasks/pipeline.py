import json
import logging
import ollama
import subprocess 
from .celery_app import celery_app

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


@celery_app.task(bind=True, max_retries=3, default_retry_delay=5)
def generate_wireframe_json(self, prompt: str) -> dict:
    """
    Task 1: Takes a text prompt and calls the local Ollama server to generate a structured JSON output.
    """
    logging.info(f"TASK 1 [generate_wireframe_json]: Received prompt - '{prompt}'")
    try:
        system_prompt = (
            "You are a UI layout expert. Your task is to convert a user's natural language "
            "description into a structured JSON object representing a UI component. The JSON must adhere to "
            "the following schema: { \"componentName\": string, \"type\": string, \"children\": array, \"props\": object }. "
            "You MUST only output the raw JSON object, with no other text or explanation."
        )
        logging.info("TASK 1: Calling local Ollama server (Llama 3.1) for wireframe generation...")
        response = ollama.chat(
            model='llama3.1:8b',
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": prompt}],
            format='json', stream=False
        )
        model_output_str = response['message']['content']
        logging.info(f"TASK 1: Received raw model output: {model_output_str}")
        json_output = json.loads(model_output_str)
        logging.info("TASK 1: Successfully generated and parsed wireframe JSON.")
        return json_output
    except Exception as e:
        logging.error(f"TASK 1: An error occurred with Ollama: {e}. Retrying...")
        raise self.retry(exc=e)


# --- THIS IS THE CORRECTED TASK 2 ---
@celery_app.task(bind=True, max_retries=3, default_retry_delay=5)
def generate_react_code(self, wireframe_json: dict) -> str:
    """
    Task 2: Takes a JSON structure and calls Code Llama to convert it into a React component string.
    """
    logging.info(f"TASK 2 [generate_react_code]: Received wireframe JSON.")
    try:
        json_input_str = json.dumps(wireframe_json, indent=2)
        system_prompt = (
            "You are a React and Tailwind CSS expert. Your task is to convert the following JSON UI structure "
            "into a single, production-ready React functional component. Use Tailwind CSS for all styling. "
            "Do not include any explanatory text, markdown formatting (like ```jsx), or anything else outside of the raw React component code itself."
        )
        
        # THIS IS THE LOG MESSAGE TO LOOK FOR
        logging.info("TASK 2: Calling local Ollama server (Code Llama) for code generation...")
        
        response = ollama.chat(
            model='codellama:7b-instruct',
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is the JSON UI structure:\n{json_input_str}"},
            ],
            stream=False
        )

        react_code = response['message']['content']
        logging.info(f"TASK 2: Received React code from model.")
        
        # Basic cleaning to remove potential markdown fences
        react_code = react_code.replace("```jsx", "").replace("```", "").strip()
        
        return react_code
    except Exception as e:
        logging.error(f"TASK 2: An error occurred with Ollama: {e}. Retrying...")
        raise self.retry(exc=e)


# This task remains the same
@celery_app.task(bind=True)
def validate_code_ast(self, react_code: str) -> dict:
    """
    Task 3: Validates the generated React code by piping it to a Node.js script
    that uses @babel/parser.
    """
    logging.info(f"TASK 3 [validate_code_ast]: Received React code to validate.")

    try:
        # Define the path to the validation script
        script_path = "app/tasks/ast_validation.js"
        
        # We need to pass the code as a UTF-8 encoded byte string
        code_bytes = react_code.encode('utf-8')

        # Run the Node.js script as a subprocess
        process = subprocess.run(
            ["node", script_path], # Command to execute
            input=code_bytes,        # Pipe the code into the script's stdin
            capture_output=True,     # Capture the stdout and stderr
            check=False,             # Do not raise an exception on a non-zero exit code
            timeout=15               # Set a timeout for safety
        )

        # The result from the script is in stdout, as a byte string. Decode it.
        result_json_str = process.stdout.decode('utf-8')
        logging.info(f"TASK 3 [validate_code_ast]: Raw output from validator: '{result_json_str}'")

        # Check if the script produced any errors
        if process.stderr:
            stderr_output = process.stderr.decode('utf-8')
            if stderr_output.strip():
                logging.error(f"AST validation script produced an error: {stderr_output}")

        # Handle empty output gracefully
        if not result_json_str.strip():
            logging.error("AST validation script returned empty output.")
            return {"code": react_code, "validation_status": "FAILURE", "errors": ["Validator returned empty output."]}

        # Parse the JSON output from the script and return it
        try:
            validation_result = json.loads(result_json_str)
        except Exception as e:
            logging.error(f"Failed to parse validator output as JSON: {e}")
            return {"code": react_code, "validation_status": "FAILURE", "errors": [f"Invalid JSON from validator: {e}"]}

        logging.info(f"TASK 3 [validate_code_ast]: Validation complete. Status: {validation_result.get('validation_status')}")
        return validation_result

    except FileNotFoundError:
        logging.error("AST validation script not found or 'node' command is not available.")
        # Return a failure state if we can't even run the script
        return {"code": react_code, "validation_status": "FAILURE", "errors": ["Validation script not found."]}
    except Exception as e:
        logging.error(f"An unexpected error occurred during AST validation: {e}")
        return {"code": react_code, "validation_status": "FAILURE", "errors": [str(e)]}