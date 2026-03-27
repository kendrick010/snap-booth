import RPi.GPIO as GPIO
import cv2, time

from utils.camera import setup_camera, cleanup_camera, capture_photo
from utils.leds import setup_leds, cleanup_leds, rainbow_cycle, transition, pulse, color_wipe, clear
from utils.button import setup_button, is_button_pressed
from utils.printer import setup_printer
from utils.upload import upload
from utils.states import States

# ==================== Globals ====================
current_state = States.IDLE
animation_frame = 0

# ==================== Event loop ====================
def cleanup():
    cleanup_camera()
    cleanup_leds()

    GPIO.cleanup()

def update_leds():
    global animation_frame
    
    # === IDLE STATE ===
    if current_state == States.IDLE:
        transition(animation_frame)
        animation_frame += 1

    # === CAPTURING STATE ===
    elif current_state == States.CAPTURING:
        color_wipe(255, 255, 255, wait_ms=0)

    # --- PROCESSING STATE ---
    elif current_state == States.PROCESSING:
        pulse(animation_frame)
        animation_frame += 1

def event_loop():
    global current_state, animation_frame

    state_start_time = 0
    captured_photo = None
    button_was_pressed = False

    while True:
        try:
            update_leds()

            # === IDLE STATE ===
            if current_state == States.IDLE:
                if is_button_pressed():
                    current_state = States.CAPTURING

                    animation_frame = 0
                    state_start_time = time.time()

            # === CAPTURING STATE ===
            elif current_state == States.CAPTURING:
                elapsed = time.time() - state_start_time

                # Wait for a second to flash white and take photo
                if elapsed >= 3.0:
                    captured_photo = capture_photo()
                    current_state = States.PROCESSING

                    animation_frame = 0
                    state_start_time = time.time()

            # --- PROCESSING STATE ---
            elif current_state == States.PROCESSING:
                elapsed = time.time() - state_start_time

                if elapsed >= 2.0 and captured_photo:
                    upload(captured_photo)

                    current_state = States.IDLE
                    animation_frame = 0

            time.sleep(0.033)

        except KeyboardInterrupt:
            break

        except Exception as e:
            print(f"Error: {e}")
            time.sleep(3)

def main():
    global camera

    try:
        # Setup
        setup_camera()
        setup_leds()
        setup_button()
        setup_printer()
        
        # Start the event loop
        event_loop()

    except Exception as e:
        print(f"Error: {e}")
    
    finally:
        cleanup()

if __name__ == "__main__":
    main()