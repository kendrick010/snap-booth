import serial

if __name__ == "__main__":
    ser = serial.Serial("/dev/usb/lp0", 9600)
    ser.write(b"Hello World\n")
    ser.close()