from fastapi import FastAPI, HTTPException
import cv2
import numpy as np
from ultralytics import YOLO
import requests
from io import BytesIO

app = FastAPI()

model = YOLO("yolov8n.pt")  # You can use a smaller or larger model like yolov8s.pt or yolov8m.pt

@app.post("/api/process-video")
async def process_video(video_url: str):
    try:
        # Download the video from the provided URL
        response = requests.get(video_url)
        video_bytes = BytesIO(response.content)
        video_capture = cv2.VideoCapture(video_bytes)

        total_people = 0
        peak_density = 0.0
        critical_areas = 0
        frame_count = 0
        hotspots = []
        
        # Process the video frame by frame
        while True:
            ret, frame = video_capture.read()
            if not ret:
                break

            # Process each frame using YOLO
            results = model(frame)

            # Count people and calculate peak density
            people_in_frame = sum([1 for result in results if result.class_id == 0])  # Class ID 0 corresponds to "person"
            total_people += people_in_frame

            # For simplicity, consider density as people per frame
            peak_density = max(peak_density, people_in_frame)

            # Find hotspots (high density locations in the frame)
            for result in results.xywh[0]:  # Get bounding boxes of detected people
                x, y, w, h, conf, cls = result.tolist()
                if conf > 0.5:  # Confidence threshold
                    hotspots.append({'x': x, 'y': y, 'intensity': conf})

            frame_count += 1

        # Critical areas based on people count (threshold example: 50 people in an area is critical)
        if total_people > 50:
            critical_areas = 1

        return {
            "totalPeople": total_people,
            "peakDensity": peak_density,
            "criticalAreas": critical_areas,
            "hotspots": hotspots,
            "alerts": [
                {"id": 1, "severity": "high", "message": "High density detected", "time": "12:00 PM", "count": 150},
                {"id": 2, "severity": "medium", "message": "Medium density detected", "time": "12:15 PM", "count": 100}
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")