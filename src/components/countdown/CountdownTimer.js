import { useState, useEffect } from "react";

export default function CountdownTimer() {
  const [seconds, setSeconds] = useState(20 * 24 * 60 * 60); // Start with 20 days in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Countdown Timer</h1>
      <div style={{ fontSize: "24px", marginBottom: "20px" }}>
        {Math.floor(seconds / (24 * 60 * 60))}d :
        {Math.floor((seconds % (24 * 60 * 60)) / 3600).toString().padStart(2, "0")}h :
        {Math.floor((seconds % 3600) / 60).toString().padStart(2, "0")}m :
        {(seconds % 60).toString().padStart(2, "0")}s
      </div>
    </div>
  );
}
