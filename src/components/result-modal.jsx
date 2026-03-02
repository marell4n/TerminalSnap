import React, { useState, useEffect } from "react";
import logoCyan from '../assets/logo-cyan.png';
import logoBlack from '../assets/logo-black.png';

export default function ResultModal({ asciiResult, onClose }) {
  const [darkPreview, setDarkPreview] = useState(null);
  const [lightPreview, setLightPreview] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const generateCanvas = (theme, callback) => {
    // Split the ASCII result into lines for proper rendering
    const lines = asciiResult.split("\n");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = 1000;
    const height = 340 + (lines.length * 8) + 250; // Logo Area (340) + Height Photo (sum of lines * 8px) + Footer Area (250)

    canvas.width = width;
    canvas.height = height;

    const isDark = theme === "dark";
    const bgColor = isDark ? "#080808" : "#ffffff";
    const textColor = isDark ? "#c3fdff" : "#000000";

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const drawContent = (logoImg) => {
      if (logoImg) {
        const logoWidth = 580;
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

      const startY = 380;
      ctx.font = "bold 6px monospace";
      ctx.fillStyle = textColor;
      ctx.textAlign = "left";
      ctx.letterSpacing = "4px";
      
      const textWidth = ctx.measureText(lines[0]).width;
      const startX = (width - textWidth) / 2;

      let currentY = startY;
      lines.forEach((line) => {
        ctx.fillText(line, startX, currentY);
        currentY += 7;
      });

      ctx.letterSpacing = "0px";

      let footerY = currentY + 30;
      ctx.font = '30px "Courier New", monospace';

      const quote =
        "No pixels were harmed in the making of \nthis photo. Only characters.";
      const quoteLines = quote.split("\n");
      const lineHeight = 26;

      quoteLines.forEach((line, index) => {
        ctx.fillText(line, startX, footerY);
        footerY += lineHeight;
      });
      footerY += 15;

      const today = new Date();
      const dateStr = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;
      ctx.fillText(dateStr, startX, footerY);

      footerY += 40;
      ctx.beginPath();
      ctx.setLineDash([15, 10]);
      ctx.moveTo(startX, footerY);
      ctx.lineTo(startX + textWidth, footerY);
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      footerY += 60;
      ctx.textAlign = "center";
      ctx.setLineDash([]);
      ctx.fillText("terminalsnap.vercel.app", width / 2, footerY);

      callback(canvas.toDataURL("image/jpeg", 1.0));
    };

    const logo = new Image();
    logo.src = isDark
      ? logoCyan
      : logoBlack;
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
        <h3 className="mb-2">/// PROCESSING_COMPLETE \\\</h3>
        <p className="mb-4">Hover to see dark theme.</p>

        <div className="atm-machine"></div>

        <div className="receipt-container mb-4 mt-2">
          <div className="receipt">
            {darkPreview && lightPreview ? (
              <img
                src={isHovered ? darkPreview : lightPreview}
                alt="Terminal Receipt"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "100%",
                  maxHeight: "35vh",
                  display: "block",
                  margin: "0 auto",
                  cursor: "crosshair",
                  transition: "opacity 0.2s ease-in-out",
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
          >
            [ SAVE DARK .JPG ]
          </button>

          <button
            className="btn btn-terminal light px-4 py-2 fw-bold"
            onClick={() => handleSaveImage("light")}
          >
            [ SAVE LIGHT .JPG ]
          </button>
        </div>
      </div>
    </div>
  );
}
