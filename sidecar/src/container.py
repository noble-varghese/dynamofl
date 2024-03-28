import json
import redis
from multiprocessing import Process, Manager
from uuid import uuid4
import time
import signal
from constants import WORKER_CREATION_QUEUE, WORKER_CREATION_EVENT
import json


class Worker:
    def __init__(self, queue_name, worker_id, event, packet_info):
        self.queue_name = queue_name
        self.worker_id = worker_id
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
                self.packet_info['packet'] = job_data
                # self.event.set()  # Set the event to signal the main process
                # return  # Exit the current worker

    def packet_consumer(self):
        while True:
            job_data = self.redis_conn.blpop(self.queue_name, timeout=1)
            if job_data:
                job_data = job_data[1]  # Extracting the job data
                if job_data == 'SPECIAL_PACKET':
                    print("Special packet detected. Signaling to add a new worker.")
                    # self.packet_info['packet'] = job_data
                    # self.event.set()  # Set the event to signal the main process
                    # return  # Exit the current worker
                self.process_job(job_data)
            else:
                print(
                    f"No jobs in the queue {self.queue_name}. Exiting worker.")
                break

    def poll_queue(self):
        if self.queue_name == WORKER_CREATION_QUEUE:
            self.poll_worker_queue()
        else:
            self.packet_consumer()

    def store_jobs(self, jobs):
        serialized_jobs = json.dumps(jobs)
        self.redis_conn.set('jobs_list', serialized_jobs)

    def restore_jobs(self):
        serialized_jobs = self.redis_conn.get('jobs_list')
        if serialized_jobs:
            return json.loads(serialized_jobs)
        return []


def create_shared_event_and_dict():
    with Manager() as manager:
        return manager.Event(), manager.dict()


def worker_process(queue_name, worker_id, event, packet_info):
    worker = Worker(queue_name, worker_id, event, packet_info)
    worker.poll_queue()


def main(jobs):
    event, packet_info = create_shared_event_and_dict()
    worker = Worker(None, None, event, packet_info)
    worker.store_jobs(jobs)  # Store the jobs list in Redis
    processes = []

    # Main process for creating workers on demand. Polls the worker_creation_queue
    p = Process(target=worker_process, args=(
        WORKER_CREATION_QUEUE, str(uuid4()), WORKER_CREATION_EVENT, packet_info))
    processes.append(p)
    p.start()

    while True:
    #     if event.is_set():
    #         print("Adding a new worker due to special packet.")
    #         print("Packet information:", packet_info['packet'])
    # #         p = Process(target=worker_process, args=(
    # #             queue, str(uuid4()), event, json.loads(packet_info)))
    # #         processes.append(p)
    # #         p.start()
    #         event.clear()  # Reset the event
    #         packet_info.clear()  # Clear the packet information
        for p in processes:
            p.join()


def signal_handler(sig, frame):
    print('Received SIGINT. Exiting...')
    exit()


if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    while True:
        main([])
