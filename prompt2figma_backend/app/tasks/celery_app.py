from celery import Celery
from app.core.config import settings

# Create the Celery instance.
# The first argument 'prompt2figma' is the name of the current module.
# This is needed so that Celery can automatically name tasks.
celery_app = Celery(
    "prompt2figma",
    # The broker is the message transport. It's our "post office" (RabbitMQ).
    broker=settings.CELERY_BROKER_URL,
    # The backend is used to store task results. It's our "fast memory" (Redis).
    backend=settings.CELERY_RESULT_BACKEND,
    # This tells Celery where to find our task definitions. We will create
    # our tasks in the 'app.tasks.pipeline' module later.
    include=["app.tasks.pipeline"]
)

# Optional Celery configuration can go here if needed in the future.
# For now, the basic setup is enough.
celery_app.conf.update(
    task_track_started=True,
)