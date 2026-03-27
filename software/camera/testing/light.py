from rpi_ws281x import PixelStrip, Color
import time

LED_COUNT = 10        # Number of LED pixels.
LED_PIN = 10          # GPIO pin connected to the pixels (must support PWM!).
LED_FREQ_HZ = 800000  # LED signal frequency in hertz (usually 800kHz)
LED_DMA = 10          # DMA channel to use for generating signal
LED_BRIGHTNESS = 64   # Set to 0 for darkest and 255 for brightest
LED_INVERT = False    # True to invert the signal
LED_CHANNEL = 0       # Set to 1 for GPIOs 13, 19, 41, 45 or 53

# Initialize the LED strip
strip = PixelStrip(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
strip.begin()

def color_wipe(color, wait_ms=500):
    """Wipe color across display one LED at a time."""
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, color)
        strip.show()
        time.sleep(wait_ms / 1000.0)

def rainbow_cycle(wait_ms=20, iterations=1):
    """Draw rainbow that cycles across all pixels."""
    for j in range(256 * iterations):
        for i in range(strip.numPixels()):
            strip.setPixelColor(i, wheel((i + j) & 255))
        strip.show()
        time.sleep(wait_ms / 1000.0)

def wheel(pos):
    """Generate rainbow colors across 0-255 positions."""
    if pos < 85:
        return Color(pos * 3, 255 - pos * 3, 0)
    elif pos < 170:
        pos -= 85
        return Color(255 - pos * 3, 0, pos * 3)
    else:
        pos -= 170
        return Color(0, pos * 3, 255 - pos * 3)

if __name__ == "__main__":
    try:
        while True:
            rainbow_cycle()
            
    except KeyboardInterrupt:
        color_wipe(Color(0, 0, 0), 10)