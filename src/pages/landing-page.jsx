import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoCyan from '../assets/logo-cyan.png'

const DUMMY_ARTS = [
  "@@@@@@@@@@\n@        @\n@  O  O  @\n@   <>   @\n@  ____  @\n@        @\n@@@@@@@@@@",
  "%%%%%%%%%%\n%        %\n%  -  -  %\n%   __   %\n%  \\__/  %\n%        %\n%%%%%%%%%%",
  "##########\n#        #\n#  >  <  #\n#   ..   #\n#  ====  #\n#        #\n##########",
  "++++++++++\n+        +\n+  ^  ^  +\n+   --   +\n+  oooo  +\n+        +\n++++++++++",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [artIndex, setArtIndex] = useState(0);

  // Change ASCII art every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setArtIndex((prevIndex) => (prevIndex + 1) % DUMMY_ARTS.length);
    }, 500);

    // Cleanup interval while component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="text-center d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div>
        <img
          src={logoCyan}
          alt="TerminalSnap Logo"
          className="img-fluid mb-3"
          style={{ maxHeight: "18vh", objectFit: "contain" }}
        />
        <p style={{ fontSize: "1.5vh" }}>by: marell4n</p>
      </div>

      {/* Container Dummy Art */}
      <div className="d-flex justify-content-center">
        <pre
          className="ascii-display p-4"
          style={{
            fontSize: "3vh",
            lineHeight: "3.2vh",
          }}
        >
          {DUMMY_ARTS[artIndex]}
        </pre>
      </div>

      <p className="fs-5 fw-bold">/// Photobooth with ASCII art. \\\</p>
      <p style={{ fontSize: "2vh" }}>Turn your everyday webcam snapshots into retro, terminal-style ASCII masterpieces!</p>

      <button
        className="btn btn-terminal px-5 py-3 fs-5 fw-bold"
        onClick={() => navigate("/booth")}
      >
        [ TRY_NOW ]
      </button>

      <footer className="mt-5" style={{ fontSize: "1.5vh" }}>
        <a
          href="https://github.com/marell4n"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--term-color)" }}
        >
          GitHub
        </a>
        {" || "}
        <a
          href="https://www.instagram.com/https.marell4n"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--term-color)" }}
        >
          Instagram
        </a>
      </footer>
    </div>
  );
}
