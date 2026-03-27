import requests, os, time, hmac, hashlib

from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    # Handle file
    with open("photo.jpg", "rb") as f:
        file_bytes = f.read()

    file_hash = hashlib.sha256(file_bytes).hexdigest()
    timestamp = str(int(time.time()))

    # Handle hmac message
    message = f"{timestamp}.{file_hash}".encode()
    secret = os.getenv("DEVICE_UPLOAD_SECRET").encode()
    signature = hmac.new(secret, message, hashlib.sha256).hexdigest()

    response = requests.post(
        "https://snap-booth-theta.vercel.app/api/upload",
        headers={
            "x-timestamp": timestamp,
            "x-signature": signature,
        },
        files={"file": ("photo.jpg", file_bytes, "image/jpeg")}
    )

    print(response.json())