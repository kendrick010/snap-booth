import cv2, os

from datetime import datetime

from config.config import CAMERA_INDEX, PHOTO_DIR, PHOTO_WIDTH, PHOTO_HEIGHT

camera = None

def setup_camera():
    global camera

    camera = cv2.VideoCapture(CAMERA_INDEX)

    camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

def cleanup_camera():
    if camera and camera.isOpened():
        camera.release()

def capture_photo():
    # Ensure camera is warmed up
    for _ in range(3):
        camera.read()

    ret, frame = camera.read()
    
    if ret:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
        filename = os.path.join(PHOTO_DIR, f"photo_{timestamp}.jpg")
        cv2.imwrite(filename, frame)

        return filename
    
    return None