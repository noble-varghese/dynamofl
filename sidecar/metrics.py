import os
import sys
import signal
import redis

redis_conn = redis.Redis(host='localhost', port=6379)

IDLE_WORKERS = 'idle_workers'
TOTAL_WORKERS = 'total_workers'


def signal_handler(sig, frame):
    print('Received SIGINT. Exiting...')
    sys.exit(0)


def getIdleWorkerCount():
    r = redis_conn
    return int(r.llen(IDLE_WORKERS) or 0)


def totalWorkers():
    r = redis_conn
    return int(r.get(TOTAL_WORKERS) or 0)


def active_workers():
    return max(0, totalWorkers() - getIdleWorkerCount())


if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    while True:
        print(f"Total Workers: {totalWorkers()}", flush=True, end=" | ")
        print(f"Active Workers: {active_workers()}", flush=True, end=" | ")
        print(
            f"Idle Workers Workers: {getIdleWorkerCount()}", flush=True, end=" | ")
        print("")
