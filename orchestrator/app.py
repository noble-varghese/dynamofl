from flask import Flask
from redis import Redis
import threading
from uwsgidecorators import postfork
import time

app = Flask(__name__)

redis_conn = Redis(host='localhost', port=7000)


def read_redis_queue():
    while True:
        # Simulate reading packets from a Redis queue
        packet = redis_conn.blpop('orchestrator_queue', timeout=2)
        if packet:
            app.logger.info(f"Received packet: {packet}")
        else:
            app.logger.info("No packets in the queue.")
        time.sleep(1)


@app.route('/ping', methods=['GET'])
def ping():
    print("Comes over here....")
    return "Pong!"


@postfork
def start_background_task():
    threading.Thread(target=read_redis_queue, daemon=True).start()


if __name__ == "__main__":
    app.run(port=8000, debug=True)
