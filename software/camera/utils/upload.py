import requests, os, time, hmac, hashlib

from config.config import DEVICE_UPLOAD_SECRET, ENDPOINT

def upload(photo_path):
    with open(photo_path, "rb") as f:
        file_bytes = f.read()

    file_hash = hashlib.sha256(file_bytes).hexdigest()
    timestamp = str(int(time.time()))

    # Handle hmac message
    message = f"{timestamp}.{file_hash}".encode()
    secret = DEVICE_UPLOAD_SECRET.encode()
    signature = hmac.new(secret, message, hashlib.sha256).hexdigest()

    response = requests.post(
        ENDPOINT,
        headers={
            "x-timestamp": timestamp,
            "x-signature": signature,
        },
        files={"file": ("photo.jpg", file_bytes, "image/jpeg")}
    )