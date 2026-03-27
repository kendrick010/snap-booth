import RPi.GPIO as GPIO
import time

from config.config import BUTTON_PIN, BUTTON_DEBOUNCE_TIME

button_debounce_time = 0

def setup_button():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

def is_button_pressed():
    global button_debounce_time
    
    current_time = time.time()
    
    if current_time - button_debounce_time < BUTTON_DEBOUNCE_TIME:
        return False
    
    if GPIO.input(BUTTON_PIN) == GPIO.LOW:
        button_debounce_time = current_time
        return True
    
    return False