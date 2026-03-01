import { useEffect, useRef, useState, useCallback } from "react";
import type { GestureRecognizer } from "@mediapipe/tasks-vision";
import { useAppContext } from "../context/AppContext";
import { CommandType } from "@kizuna/types";

export function useGestureRecognition(onGestureDetected?: (command: CommandType) => void) {
  const { gestureEnabled, setCameraPermission, cameraPermission } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gestureRecognizer, setGestureRecognizer] = useState<GestureRecognizer | null>(null);
  const [tasksVision, setTasksVision] = useState<any>(null);
  const [detectedGestureName, setDetectedGestureName] = useState<string | null>(null);
  const requestRef = useRef<number>();
  const lastGestureTime = useRef<number>(0);
  const isProcessing = useRef(false);

  // Initialize MediaPipe Gesture Recognizer
  useEffect(() => {
    const init = async () => {
      try {
        const vision = await import("@mediapipe/tasks-vision");
        setTasksVision(vision);
        
        const { FilesetResolver, GestureRecognizer } = vision;
        const visionTasks = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const recognizer = await GestureRecognizer.createFromOptions(visionTasks, {
          baseOptions: {
            modelAssetPath: "/models/gesture_recognizer.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        setGestureRecognizer(recognizer);
      } catch (error) {
        console.error("Failed to load gesture recognizer:", error);
      }
    };
    if (typeof window !== 'undefined') {
        init();
    }
  }, []);

  const predictWebcam = useCallback(() => {
    if (!gestureRecognizer || !videoRef.current || !canvasRef.current || !tasksVision) return;

    const { GestureRecognizer, DrawingUtils } = tasksVision;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Ensure video is playing and has dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to match video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const nowInMs = Date.now();
    
    // Perform recognition
    const results = gestureRecognizer.recognizeForVideo(video, nowInMs);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw landmarks
    if (results.landmarks) {
      const drawingUtils = new DrawingUtils(ctx);
      for (const landmarks of results.landmarks) {
        drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        drawingUtils.drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 2 });
      }
    }

    // Process Gestures
    if (results.gestures.length > 0) {
      const gesture = results.gestures[0][0];
      const categoryName = gesture.categoryName;
      const score = gesture.score;

      if (score > 0.6) { // Confidence threshold
        setDetectedGestureName(`${categoryName} (${Math.round(score * 100)}%)`);
        
        // Map Gestures to Commands (Debounced)
        // 1.5s cooldown to prevent rapid firing
        if (nowInMs - lastGestureTime.current > 1500) { 
          let command: CommandType | null = null;
          
          if (categoryName === "Open_Palm") command = "stop";
          else if (categoryName === "Pointing_Up") command = "come";
          else if (categoryName === "Closed_Fist") command = "danger";

          if (command && onGestureDetected) {
            onGestureDetected(command);
            lastGestureTime.current = nowInMs;
          }
        }
      }
    } else {
      setDetectedGestureName(null);
    }

    requestRef.current = requestAnimationFrame(predictWebcam);
  }, [gestureRecognizer, tasksVision, onGestureDetected]);


  // Start Camera and Recognition Loop
  useEffect(() => {
    if (!gestureEnabled || !gestureRecognizer || cameraPermission !== "granted") return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predictWebcam);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraPermission("denied");
      }
    };

    if (!isProcessing.current) {
        startCamera();
        isProcessing.current = true;
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      isProcessing.current = false;
    };
  }, [gestureEnabled, gestureRecognizer, cameraPermission, predictWebcam, setCameraPermission]);

  const requestCameraAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission("granted");
    } catch (e) {
      setCameraPermission("denied");
    }
  };

  return { 
    videoRef, 
    canvasRef, 
    requestCameraAccess, 
    detectedGestureName,
    isReady: !!gestureRecognizer 
  };
}
