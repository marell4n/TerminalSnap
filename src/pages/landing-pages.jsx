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
    <div className="text-center mt-5">
      <div>
        <img
          src="/src/assets/logo.png"
          alt="Terminal Snap Logo"
          className="img-fluid mb-4"
        />
      </div>

      {/* Container Dummy Art */}
      <div className="d-flex justify-content-center mb-5">
        <pre
          className="ascii-display p-4"
          style={{
            borderColor: "var(--term-color)",
            fontSize: "25px",
            lineHeight: "30px",
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
    </div>
  );
}
