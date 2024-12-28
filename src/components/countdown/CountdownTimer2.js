import { useState, useEffect } from "react";

export default function CountdownTimer2() {
  const calculateSecondsUntil20DaysAway = () => {
    const now = new Date();
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + 20);
    return Math.floor((targetDate - now) / 1000);
  };

  const [seconds, setSeconds] = useState(calculateSecondsUntil20DaysAway());

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <ul className="count-down mt-35">
      <li>
        <span>
          
        {Math.floor(seconds / (24 * 60 * 60))}
        </span>
        days
        </li>
       <li>
       <span>
          
        {Math.floor((seconds % (24 * 60 * 60)) / 3600).toString().padStart(2, "0")}
        </span>
        hours
        </li>
       <li><span>
          {Math.floor((seconds % 3600) / 60).toString().padStart(2, "0")}
          </span>
          minutes
          </li>
       <li>
       <span>
          
        {(seconds % 60).toString().padStart(2, "0")}
          </span>
        seconds
        </li>
      </ul>
      {/* <h1>Countdown Timer</h1> */}
      {/* <div style={{ fontSize: "24px", marginBottom: "20px" }}>
        {Math.floor(seconds / (24 * 60 * 60))}d :
        {Math.floor((seconds % (24 * 60 * 60)) / 3600).toString().padStart(2, "0")}h :
        {Math.floor((seconds % 3600) / 60).toString().padStart(2, "0")}m :
        {(seconds % 60).toString().padStart(2, "0")}s
      </div> */}
    </div>
  );
}
