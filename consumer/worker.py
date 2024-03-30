import signal
import time
import redis
from multiprocessing import Process
from uuid import uuid4

# Function to simulate processing of a job

redis_conn = redis.Redis(host='localhost', port=6379)

IDLE_WORKERS = 'idle_workers'
TOTAL_WORKERS = 'total_workers'


def process_job(job_data):
    # Simulate processing time
    time.sleep(2)
    # Process job data
    print("Processing job:", job_data)

# Function for worker process


def getIdleWorkerCount():
    r = redis_conn
    return int(r.llen(IDLE_WORKERS) or 0)


def getIdleWorkers():
    r = redis_conn
    if getIdleWorkerCount() == 0:
        return []
    return r.lrange(IDLE_WORKERS, 0, getIdleWorkerCount())


def worker(queue_name, worker_id):
    # Connect to Redis
    r = redis_conn

    while True:
        # Pop job from the queue
        job_data = r.blpop(queue_name, timeout=1)

        if job_data:
            job_data = job_data[1]  # Extracting the job data
            process_job(job_data)
        else:
            print(f"No jobs in the queue {queue_name}. Exiting worker.")
            if worker_id not in getIdleWorkers():
                r.rpush(IDLE_WORKERS, worker_id)
            break

# Main function to start worker processes


def insert_records(queue_name, num_records, nums):
    r = redis_conn

    # Insert records into the queue
    for i in range(num_records):
        job_data = f"Record {i+1}"
        r.rpush(queue_name, job_data)
        print(f"Inserted record: {job_data}")


def main(jobs):
    # Define the queue name

    # Create and start worker processes
    processes = []
    for job in jobs:
        queue = job['queue']
        num_workers = job['w']
        for _ in range(num_workers):
            p = Process(target=worker, args=(queue, str(uuid4()),))
            processes.append(p)
            p.start()

    # Wait for all worker processes to finish
    for p in processes:
        p.join()


def update_total_workers(n):
    r = redis_conn
    r.set(TOTAL_WORKERS, n)


def update_idle_workers(n):
    r = redis_conn
    r.set(IDLE_WORKERS, n)


def signal_handler(sig, frame):
    print('Received SIGINT. Exiting...')
    # main()
    update_total_workers(0)
    exit()


if __name__ == "__main__":
    jobs = [
        {
            "queue": 'job-1',
            "f": 10,
            "c": 10,
            "w": 5
        },
        {
            "queue": 'job-2',
            "f": 20,
            "c": 10,
            "w": 5
        },
        {
            "queue": 'job-3',
            "f": 30,
            "c": 10,
            "w": 5
        }
    ]
    total_workers = 0
    for job in jobs:
        queue = job['queue']
        f = job['f']
        c = job['c']
        w = job['w']
        insert_records(queue, f, c)
        total_workers += w

    update_total_workers(total_workers)

    print('inserted records to queue...')
    signal.signal(signal.SIGINT, signal_handler)
    while True:
        main(jobs)
        print("Looping through ::::::::::::::::::::::::::::::::")
