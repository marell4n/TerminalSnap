import React, { useState, useEffect } from "react";

export default function ResultModal({ asciiResult, onClose }) {
  const [darkPreview, setDarkPreview] = useState(null);
  const [lightPreview, setLightPreview] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const generateCanvas = (theme, callback) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = 800;
    const height = 1200;
    canvas.width = width;
    canvas.height = height;

    const isDark = theme === "dark";
    const bgColor = isDark ? "#080808" : "#ffffff";
    const textColor = isDark ? "#c3fdff" : "#000000";

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const drawContent = (logoImg) => {
      if (logoImg) {
        const logoWidth = 500;
        const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
        ctx.drawImage(
          logoImg,
          (width - logoWidth) / 2,
          80,
          logoWidth,
          logoHeight,
        );
      } else {
        ctx.fillStyle = textColor;
        ctx.font = 'bold 60px "Courier New", monospace';
        ctx.textAlign = "center";
        ctx.fillText("Terminal Snap", width / 2, 150);
      }

      const startY = 320;
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = textColor;
      ctx.textAlign = "left";
      ctx.letterSpacing = "2px";

      const lines = asciiResult.split("\n");
      const textWidth = ctx.measureText(lines[0]).width;
      const startX = (width - textWidth) / 2;

      let currentY = startY;
      lines.forEach((line) => {
        ctx.fillText(line, startX, currentY);
        currentY += 8;
      });

      ctx.letterSpacing = "0px";

      const footerY = currentY + 80;
      ctx.font = '24px "Courier New", monospace';

      const today = new Date();
      const dateStr = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;
      ctx.fillText(dateStr, startX, footerY);

      ctx.beginPath();
      ctx.setLineDash([15, 10]);
      ctx.moveTo(startX, footerY + 40);
      ctx.lineTo(startX + textWidth, footerY + 40);
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.setLineDash([]);
      ctx.fillText("terminalsnap.vercel.app", width / 2, footerY + 110);

      callback(canvas.toDataURL("image/jpeg", 1.0));
    };

    const logo = new Image();
    logo.src = isDark
      ? "/src/assets/logo-cyan.png"
      : "/src/assets/logo-black.png";
    logo.onload = () => drawContent(logo);
    logo.onerror = () => drawContent(null);
  };

  useEffect(() => {
    generateCanvas("dark", (dataUrl) => {
      setDarkPreview(dataUrl);
    });
    generateCanvas("light", (dataUrl) => {
      setLightPreview(dataUrl);
    });
  }, [asciiResult]);

  const handleSaveImage = (theme) => {
    generateCanvas(theme, (dataUrl) => {
      const link = document.createElement("a");
      link.download = `TERMINAL_SNAP_${theme.toUpperCase()}_${new Date().getTime()}.jpg`;
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-terminal text-center">
        <h3 className="mb-4">/// PROCESSING_COMPLETE \\\</h3>

        <div className="atm-machine"></div>

        <div className="receipt-container mb-4">
          <div className="receipt">
            {darkPreview && lightPreview ? (
              <img
                src={isHovered ? lightPreview : darkPreview} 
                alt="Terminal Receipt"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ 
                  width: "100%", 
                  maxWidth: "35vh", 
                  display: "block",
                  margin: "0 auto",
                  cursor: "crosshair",
                  transition: "opacity 0.2s ease-in-out" 
                }}
              />
            ) : (
              <p className="m-5">/// GENERATING_IMAGE... \\\</p>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
          <button
            className="btn btn-terminal px-4 py-2 fw-bold"
            onClick={onClose}
          >
            [ CLOSE ]
          </button>

          <button
            className="btn btn-terminal px-4 py-2 fw-bold"
            onClick={() => handleSaveImage("dark")}
            style={{
              backgroundColor: "#000",
              color: "var(--term-color)",
              border: "1px solid var(--term-color)",
            }}
          >
            [ SAVE DARK .JPG ]
          </button>

          <button
            className="btn px-4 py-2 fw-bold"
            onClick={() => handleSaveImage("light")}
            style={{
              backgroundColor: "#fff",
              color: "#000",
              border: "1px solid #000",
            }}
          >
            [ SAVE LIGHT .JPG ]
          </button>
        </div>
      </div>
    </div>
  );
}
