import json
import redis
import threading
# from threading import
import atexit
from uuid import uuid4
import time
import signal
from constants import OUTPUT_FILE_PATH, WORKER_CREATION_QUEUE, WORKER_WAITING_FOR_PACKETS_STATUS, WORKER_RUNNING_STATUS, WORKER_COMPLETED_STATUS
from client import Client
import pandas as pd
import os

WORKERS = {}
THREADS = {}
event = threading.Event()


class Worker:
    def __init__(self, queue_name, worker_id, thread_id, event, packet_info):
        self.worker_id = worker_id
        self.queue_name = queue_name
        self.thread_id = thread_id
        self.event = event
        self.packet_info = packet_info
        self.client = Client(base_url="http://13.215.183.121:5000/v1")
        self.redis_conn = redis.Redis(
            host='test.g369sf.ng.0001.apse1.cache.amazonaws.com', port=6379)

    def create_folder_path(self, job_id):
        home_folder = os.path.expanduser("~")
        job_folder = os.path.join(
            home_folder, "job_files", str(job_id), "output_data")
        return job_folder

    def process_job(self, job_data):
        nums = job_data['random_nums']
        file_count = job_data['file_num']
        data = [i/file_count for i in nums]
        path = self.create_folder_path(job_data['job_id'])
        file_path = f"{path}/file-{uuid4()}.csv"

        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        df = pd.DataFrame([data])
        df.to_csv(file_path, index=False, header=False)
        print(f'Saved file - {path}')

    def poll_worker_queue(self):
        while True:
            job_data = self.redis_conn.blpop(self.queue_name, timeout=1)
            if job_data:
                job_data = job_data[1]  # Extracting the job data
                print("Worker creation packet detected. Signaling to add a new worker.")
                self.packet_info['packet'] = json.loads(job_data)
                self.remove_thread()  # Delete existing thread
                self.event.set()  # Set the event to signal the main process
                return  # Exit the current worker
            else:
                print(
                    f"No jobs in the queue {self.worker_id} | {self.thread_id}")

    def remove_thread(self):
        del THREADS[self.thread_id]

    def set_worker_status_running(self):
        self.client.put(f'worker/{self.worker_id}', json={
            "status": WORKER_RUNNING_STATUS
        })

    def set_worker_status_completed(self):
        self.client.put(f'worker/{self.worker_id}', json={
            "status": WORKER_COMPLETED_STATUS

        })

    def set_worker_waiting_for_pkt(self):
        self.client.put(f'worker/{self.worker_id}', json={
            "status": WORKER_WAITING_FOR_PACKETS_STATUS
        })

    def packet_consumer(self):
        is_started = False  # Tracker to check if queue has started
        self.set_worker_waiting_for_pkt()
        while not self.event.is_set():
            job_data = self.redis_conn.blpop(self.queue_name, timeout=1)
            if job_data:
                if not is_started:
                    self.set_worker_status_running()
                    is_started = True
                job_data = job_data[1]  # Extracting the job data
                self.process_job(json.loads(job_data))
            else:
                print(
                    f"No jobs in the queue {self.worker_id} | {self.thread_id}")
                # If the consumer started and if no more packet is present, then we can safely exit the thread
                if is_started:
                    self.set_worker_status_completed()
                    self.remove_thread()
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


def worker_thread(queue_name, worker_id, thread_id, event, packet_info):
    worker = Worker(queue_name, worker_id, thread_id, event, packet_info)
    if queue_name == WORKER_CREATION_QUEUE:
        worker.poll_worker_queue()
    else:
        worker.packet_consumer()


def create_worker_creation_thread(worker_id, event, packet_info):
    thread_id = f"main_thread_{str(uuid4())}"
    t = threading.Thread(target=worker_thread, args=(
        WORKER_CREATION_QUEUE, worker_id, thread_id, event, packet_info))
    t.daemon = True
    return thread_id, t


def worker_spawn_thread(queue_name, thread_id, event, packet_info):
    thread_id = f"main_thread_{str(uuid4())}"
    t = threading.Thread(target=worker_thread, args=(
        queue_name, thread_id, event, packet_info))
    return thread_id, t


def main():
    event, packet_info = create_shared_event_and_dict()
    thread_id, t = create_worker_creation_thread(
        str(uuid4()), event, packet_info)
    THREADS[thread_id] = t
    t.start()

    for _, v in WORKERS.items():
        thread_id = f"worker_thread_{str(uuid4())}"
        t = threading.Thread(target=worker_thread, args=(
            v['queue_name'], v['worker_id'], thread_id, event, packet_info))
        THREADS[thread_id] = t
        t.daemon = True
        t.start()

    for thread_id, thread in [[k, v] for k, v in THREADS.items()]:
        print('joining...', thread_id)
        thread.join()

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


def signal_handler(sig, frame):
    event.set()
    print('Received SIGINT. Exiting...')
    exit()


def stop_background(stop_event, thread):
    # request the background thread stop
    stop_event.set()
    # wait for the background thread to stop
    thread.join()


if __name__ == "__main__":
    # # Add the main worker_creation consumer queueu
    # atexit.register(stop_background, stop_event, thread)

    signal.signal(signal.SIGINT, signal_handler)
    while True:
        main()
