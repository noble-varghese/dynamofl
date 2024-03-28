import json
import redis
import threading
from uuid import uuid4
import time
import signal
from constants import WORKER_CREATION_QUEUE, WORKER_CREATION_EVENT

WORKERS = {}
THREADS = {}
event = threading.Event()


class Worker:
    def __init__(self, queue_name, thread_id, event, packet_info):
        self.queue_name = queue_name
        self.thread_id = thread_id
        self.event = event
        self.packet_info = packet_info
        self.redis_conn = redis.Redis(host='localhost', port=6379)

    def process_job(self, job_data):
        # Simulate processing time
        time.sleep(2)
        # Process job data
        print("Processing job:", job_data)

    def poll_worker_queue(self):
        while True:
            job_data = self.redis_conn.blpop(self.queue_name, timeout=1)
            if job_data:
                job_data = job_data[1]  # Extracting the job data
                print("Worker creation packet detected. Signaling to add a new worker.")
                self.packet_info['packet'] = json.loads(job_data)
                self.remove_thread(self.thread_id)  # Delete existing thread
                self.event.set()  # Set the event to signal the main process
                return  # Exit the current worker

    def remove_thread(self, id):
        del THREADS[id]

    def packet_consumer(self):
        is_started = False  # Tracker to check if queue has started
        while not self.event.is_set():
            job_data = self.redis_conn.blpop(self.queue_name, timeout=1)
            if job_data:
                is_started = True
                job_data = job_data[1]  # Extracting the job data
                print("Special packet detected. Signaling to add a new worker.")
                # self.packet_info['packet'] = job_data
                # self.event.set()  # Set the event to signal the main process
                # return  # Exit the current worker
                self.process_job(job_data)
            else:
                print(
                    f"No jobs in the queue {self.queue_name}. Exiting worker.")
                # If the consumer started and if no more packet is present, then we can safely exit the thread
                if is_started:
                    return

    def store_jobs(self, jobs):
        serialized_jobs = json.dumps(jobs)
        self.redis_conn.set('jobs_list', serialized_jobs)

    def restore_jobs(self):
        serialized_jobs = self.redis_conn.get('jobs_list')
        if serialized_jobs:
            return json.loads(serialized_jobs)
        return []


def create_shared_event_and_dict():
    event = threading.Event()
    packet_info = {}
    return event, packet_info


def worker_thread(queue_name, thread_id, event, packet_info):
    worker = Worker(queue_name, thread_id, event, packet_info)
    if queue_name == WORKER_CREATION_QUEUE:
        worker.poll_worker_queue()
    else:
        worker.packet_consumer()


def create_worker_creation_thread(event, packet_info):
    thread_id = str(uuid4())
    t = threading.Thread(target=worker_thread, args=(
        WORKER_CREATION_QUEUE, thread_id, event, packet_info))
    t.daemon = True
    return thread_id, t


def worker_spawn_thread(queue_name, thread_id, event, packet_info):
    thread_id = str(uuid4())
    t = threading.Thread(target=worker_thread, args=(
        queue_name, thread_id, event, packet_info))
    return thread_id, t


def main():
    event, packet_info = create_shared_event_and_dict()
    thread_id, t = create_worker_creation_thread(event, packet_info)
    THREADS[thread_id] = t
    t.start()

    for _, v in WORKERS.items():
        thread_id = str(uuid4())
        t = threading.Thread(target=worker_thread, args=(
            v['queue_name'], thread_id, event, packet_info))
        THREADS[thread_id] = t
        t.daemon = True
        t.start()

    while True:  # Continuously check for the event being set
        if event.is_set():
            print("Adding a new worker due to special packet.", event.__dict__)
            print("Packet information:", packet_info['packet'])
            d = packet_info['packet']
            # time.sleep(5)
            WORKERS[d['worker_id']] = d

            event.clear()  # Reset the event
            packet_info.clear()  # Clear the packet information

            return

            # Ensure all threads are joined before checking the event again
            # Add logic here to add a new worker based on your job configuration

        else:
            # If the event is not set, sleep for a short period to avoid busy-waiting
            time.sleep(1)
            for thread_id, thread in [[k, v] for k, v in THREADS.items()]:
                print('joining...', thread_id)
                thread.join()


def signal_handler(sig, frame):
    event.set()
    print('Received SIGINT. Exiting...')
    exit()


if __name__ == "__main__":
    # Add the main worker_creation consumer queueu
    signal.signal(signal.SIGINT, signal_handler)
    while True:
        main()
        print(WORKERS)
