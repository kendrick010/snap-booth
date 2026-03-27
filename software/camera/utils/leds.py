from config.config import (
    LED_COUNT,
    LED_PIN,
    LED_FREQ_HZ,
    LED_DMA,
    LED_BRIGHTNESS,
    LED_INVERT,
    LED_CHANNEL
)

from rpi_ws281x import PixelStrip, Color
import time, math

strip = None

def setup_leds():
    global strip

    strip = PixelStrip(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
    strip.begin()

def cleanup_leds():
    clear()

def rainbow_cycle(wait_ms=20, iterations=1):
    for j in range(256 * iterations):
        for i in range(strip.numPixels()):
            strip.setPixelColor(i, wheel((i + j) & 255))
            
        strip.show()
        time.sleep(wait_ms / 1000.0)

def wheel(pos):
    if pos < 85:
        return Color(pos * 3, 255 - pos * 3, 0)
    elif pos < 170:
        pos -= 85
        return Color(255 - pos * 3, 0, pos * 3)
    else:
        pos -= 170
        return Color(0, pos * 3, 255 - pos * 3)

def transition(frame=0):
    hue = (frame * 2) % 360
    rgb = hsv_to_rgb(hue / 360.0, 0.8, 0.3)
    color = Color(int(rgb[0]), int(rgb[1]), int(rgb[2]))
    
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, color)

    strip.show()

def pulse(frame=0):
    intensity = int(128 + 127 * math.sin(frame * 0.1))
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, Color(0, 0, intensity))

    strip.show()

def clear():
    color_wipe(0, 0, 0)

def color_wipe(red, green, blue, wait_ms=500):
    color = Color(red, green, blue)

    for i in range(strip.numPixels()):
        strip.setPixelColor(i, color)
        strip.show()
        time.sleep(wait_ms / 1000.0)

def hsv_to_rgb(h, s, v):
    if s == 0.0:
        return (v*255, v*255, v*255)

    i = int(h*6.0)
    f = (h*6.0) - i
    p = v*(1.0 - s)
    q = v*(1.0 - s*f)
    t = v*(1.0 - s*(1.0-f))
    i = i%6

    if i == 0:
        return (v*255, t*255, p*255)
    if i == 1:
        return (q*255, v*255, p*255)
    if i == 2:
        return (p*255, v*255, t*255)
    if i == 3:
        return (p*255, q*255, v*255)
    if i == 4:
        return (t*255, p*255, v*255)
    if i == 5:
        return (v*255, p*255, q*255)
