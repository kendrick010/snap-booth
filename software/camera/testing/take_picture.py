import cv2

if __name__ == "__main__":
    cap = cv2.VideoCapture(0)

    ret, frame = cap.read()

    if ret:
        cv2.imwrite("photo.jpg", frame)
        print("Photo saved!")
    else:
        print("Failed to capture image")

    cap.release()