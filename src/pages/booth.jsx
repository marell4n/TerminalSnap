import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResultModal from "../components/result-modal.jsx";

const ASCII_CHARS = [
  "@",
  "#",
  "S",
  "%",
  "?",
  "*",
  "+",
  ";",
  ":",
  ",",
  ".",
  " ",
];

export default function TakePicturePage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // State Camera & Timer
  const [timerStatus, setTimerStatus] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);
  const [isFlashEnabled, setIsFlashEnabled] = useState(true);
  const [capturedImg, setCapturedImg] = useState(null);

  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [asciiResult, setAsciiResult] = useState("");

  // Start & Stop Camera
  useEffect(() => {
    let isMounted = true;
    let activeStream = null;

    // Start Camera if not captured yet and modal is not open
    if (!capturedImg && !showModal) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (isMounted && videoRef.current) {
            videoRef.current.srcObject = stream;
            activeStream = stream;
          } else {
            stream.getTracks().forEach((track) => track.stop());
          }
        })
        .catch((err) => console.error("Kamera error:", err));
    }
    // Off Camera if state changed and switching page
    return () => {
      isMounted = false;

      // Stop stream from local state
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }

      // Cleanup stream from videoRef
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [capturedImg, showModal]);

  const handleTakePhoto = () => {
    if (timerStatus === 0) {
      executeCapture();
    } else {
      let count = timerStatus;
      setCountdown(count);
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count === 0) {
          clearInterval(interval);
          setCountdown(null);
          executeCapture();
        }
      }, 1000);
    }
  };

  const executeCapture = () => {
    const takePhoto = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImg(canvas.toDataURL("image/png"));
      }
    };

    if (isFlashEnabled) {
      setFlash(true);
      setTimeout(() => {
        takePhoto();
        setTimeout(() => {
          setFlash(false);
        }, 200);
      }, 250);
    } else {
      takePhoto();
    }
  };

  const handleConvert = () => {
    if (!capturedImg) return;
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const newWidth = 100;
      const aspectRatio = img.height / img.width;
      const newHeight = Math.floor(aspectRatio * newWidth);

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Mirror
      ctx.translate(newWidth, 0);
      ctx.scale(-1, 1);

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const pixels = ctx.getImageData(0, 0, newWidth, newHeight).data;
      let asciiStr = "";

      const brightnessFactor = 1.2; // 1.2 = +20%
      const contrastFactor = 1.5;   // 1.5 = +50%

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        // Change to grayscale with brightness and contrast adjustment
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        gray = ((gray - 128) * contrastFactor + 128) * brightnessFactor;
        gray = Math.max(0, Math.min(255, gray));
        const charIndex = Math.floor(
          (gray / 255) * (ASCII_CHARS.length - 1),
        );
        asciiStr += ASCII_CHARS[charIndex];
        if ((i / 4 + 1) % newWidth === 0) asciiStr += "\n";
      }

      setAsciiResult(asciiStr);
      setShowModal(true);
    };
    img.src = capturedImg;
  };

  return (
    <div className="text-center position-relative mt-2">
      {flash && <div className="flash-effect"></div>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-sm btn-terminal px-3"
          onClick={() => navigate("/")}
        >
          [ BACK ]
        </button>
      </div>

      {/* Area Layar Kamera / Foto */}
      <div className="mb-4 position-relative d-inline-block">
        {!capturedImg ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: "100%", maxWidth: "800px", display: "block" }}
            />
            {countdown !== null && (
              <h1
                className="position-absolute top-50 start-50 translate-middle fw-bold"
                style={{
                  fontSize: "6rem",
                  textShadow: "0 0 20px var(--term-color)",
                  color: "#fff",
                }}
              >
                {countdown}
              </h1>
            )}
          </>
        ) : (
          <img
            src={capturedImg}
            alt="Captured"
            className="captured-img"
            style={{ width: "100%", maxWidth: "800px", display: "block" }}
          />
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {/* Area Tombol Kontrol */}
      <div>
        {!capturedImg ? (
          <>
            <div className="d-flex justify-content-center flex-wrap gap-3 mb-4">
              <div className="btn-group" role="group">
                <button
                  className={`btn btn-terminal ${timerStatus === 0 ? "active" : ""}`}
                  onClick={() => setTimerStatus(0)}
                >
                  NO_TIMER
                </button>
                <button
                  className={`btn btn-terminal ${timerStatus === 3 ? "active" : ""}`}
                  onClick={() => setTimerStatus(3)}
                >
                  3_SEC
                </button>
                <button
                  className={`btn btn-terminal ${timerStatus === 5 ? "active" : ""}`}
                  onClick={() => setTimerStatus(5)}
                >
                  5_SEC
                </button>
              </div>

              <button
                className={`btn btn-terminal ${isFlashEnabled ? "active" : ""}`}
                onClick={() => setIsFlashEnabled(!isFlashEnabled)}
              >
                FLASH: {isFlashEnabled ? "ON" : "OFF"}
              </button>
            </div>
            <br />
            <button
              className="btn btn-terminal px-5 py-3 fs-4 fw-bold"
              onClick={handleTakePhoto}
              disabled={countdown !== null}
            >
              [ CAPTURE ]
            </button>
          </>
        ) : (
          <div className="d-flex justify-content-center gap-4 mt-2">
            <button
              className="btn btn-terminal px-4 py-2 fs-5"
              onClick={() => setCapturedImg(null)}
            >
              [ RETAKE ]
            </button>
            <button
              className="btn btn-terminal px-4 py-2 fs-5 fw-bold"
              onClick={handleConvert}
              style={{
                backgroundColor: "var(--term-color)",
                color: "var(--term-bg)",
              }}
            >
              [ CONVERT_TO_ASCII ]
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <ResultModal
          asciiResult={asciiResult}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
