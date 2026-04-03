import glob

CAMERA_DEVICE = "/dev/v4l/by-id/*"
PRINTER_DEVICE = "/dev/v4l/by-id/*"

def get_camera():
    devices = glob.glob("/dev/v4l/by-id/*")
    if devices:
        return devices[0]

    raise RuntimeError("Camera not found")

def get_printer():
    devices = glob.glob("/dev/usb/lp*")
    if devices:
        return devices[0]

    raise RuntimeError("Printer not found")