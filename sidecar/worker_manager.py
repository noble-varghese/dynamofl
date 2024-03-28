from multiprocessing import Process, Manager
import redis
import time
from uuid import uuid4
# Create a shared event object
redis_conn = redis.Redis(host='localhost', port=6379)


def create_shared_event():
    with Manager() as manager:
        return manager.Event()

# Modify the worker function to set the event when the special packet is detected


def process_job(job_data):
    # Simulate processing time
    time.sleep(2)
    # Process job data
    print("Processing job:", job_data)


def worker(queue_name, worker_id, event):
    r = redis_conn
    while True:
        job_data = r.blpop(queue_name, timeout=1)
        if job_data:
            job_data = job_data[1]
            if job_data == 'SPECIAL_PACKET':
                print("Special packet detected. Signaling to add a new worker.")
                event.set()  # Set the event to signal the main process
                return  # Exit the current worker
            process_job(job_data)
        else:
            print(f"No jobs in the queue {queue_name}. Exiting worker.")
            # if worker_id not in getIdleWorkers():
            #     r.rpush(IDLE_WORKERS, worker_id)
            break

# Modify the main function to listen for the event and add a new worker when the event is set


def main(jobs):
    event = create_shared_event()
    processes = []
    for job in jobs:
        queue = job['queue']
        num_workers = job['w']
        for _ in range(num_workers):
            p = Process(target=worker, args=(queue, str(uuid4()), event))
            processes.append(p)
            p.start()

    while True:
        if event.is_set():
            print("Adding a new worker due to special packet.")
            # Add logic here to add a new worker based on your job configuration
            event.clear()  # Reset the event
        for p in processes:
            p.join()
