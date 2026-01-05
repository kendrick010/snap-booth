import time
import cv2
import numpy as np
from rpi_ws281x import PixelStrip, Color
import RPi.GPIO as GPIO
import os
from datetime import datetime

def state_machine():
    pass

def main():
    try:
        # Setup components
        setup_leds()
        setup_button()
        setup_camera()
        
        state_machine()

    except Exception as e:
        print(f"Error: {e}")
    
    finally:
        # Cleanup
        set_all_leds(Color(0, 0, 0))
        
        if camera and camera.isOpened():
            camera.release()
        
        cv2.destroyAllWindows()
        GPIO.cleanup()

if __name__ == "__main__":
    main()

# https://chat.deepseek.com/share/0kcnz896xa3aon7p69