import os
from dotenv import load_dotenv

from devices import get_camera, get_printer

load_dotenv() 

# ==================== Camera config ====================
CAMERA_INDEX = get_camera()

PHOTO_DIR = "captured_photos"
PHOTO_WIDTH = 640
PHOTO_HEIGHT = 480

# ==================== Printer config ====================
PRINTER_INDEX = get_printer()

# ==================== Button config ====================
BUTTON_PIN = 17
BUTTON_DEBOUNCE_TIME = 0.3

# ==================== POST request ====================
ENDPOINT = "https://snap-booth-theta.vercel.app/api/upload"
DEVICE_UPLOAD_SECRET = os.getenv("DEVICE_UPLOAD_SECRET")

# ==================== Led config ====================

LED_COUNT = 10              # Number of LED pixels.
LED_PIN = 10                # GPIO pin connected to the pixels (must support PWM!).
LED_FREQ_HZ = 800000        # LED signal frequency in hertz (usually 800kHz)
LED_DMA = 10                # DMA channel to use for generating signal
LED_BRIGHTNESS = 64         # Set to 0 for darkest and 255 for brightest
LED_INVERT = False          # True to invert the signal
LED_CHANNEL = 0             # Set to 1 for GPIOs 13, 19, 41, 45 or 53

print(CAMERA_INDEX)
print(PRINTER_INDEX)