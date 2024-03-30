"""dfvdfkv"""
import redis

r = redis.Redis()


def acquire_lock(lock_key, lock_value, timeout=10):
    if r.setnx(lock_key, lock_value):
        r.expire(lock_key, timeout)
        return True
    return False


def release_lock(lock_key, lock_value):
    if r.get(lock_key) == lock_value:
        r.delete(lock_key)
        return True
    return False


# Example usage
lock_key = "worker_count_lock"
lock_value = "locked"

if acquire_lock(lock_key, lock_value):
    try:
        # Perform operations that require exclusive access
        # such as incrementing or decrementing the worker count
        pass
    finally:
        release_lock(lock_key, lock_value)
