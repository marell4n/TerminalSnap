import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      style={{ height: "90vh" }}
    >
      <div>
        <img
          src="/src/assets/logo-cyan.png"
          alt="TerminalSnap Logo"
          className="img-fluid mb-3"
          style={{ maxHeight: "18vh", objectFit: "contain" }}
        />
        <p style={{ fontSize: "1.5vh" }}>by: marell4n</p>
      </div>

      {/* Container Dummy Art */}
      <div className="d-flex justify-content-center mb-4">
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

      <p className="mb-4 fs-5">/// Photobooth with ASCII art. \\\</p>

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
