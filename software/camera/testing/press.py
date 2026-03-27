import RPi.GPIO as GPIO
import time

BUTTON_PIN = 17

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

if __name__ == "__main__":
    try:
        while True:
            if GPIO.input(BUTTON_PIN) == GPIO.LOW:
                print("pressed")
                time.sleep(0.3)

    except KeyboardInterrupt:
        print("Exit")

    finally:
        GPIO.cleanup()