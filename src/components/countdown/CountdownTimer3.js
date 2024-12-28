import { useState, useEffect } from "react";

export default function CountdownTimer3() {
  const calculateTimeUntil20DaysAway = () => {
    const now = new Date();
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + 20);
    const totalSeconds = Math.floor((targetDate - now) / 1000);

    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeUntil20DaysAway());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds =
          prev.days * 24 * 60 * 60 + prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) {
          clearInterval(timer);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return calculateTimeUntil20DaysAway();
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {/* <h1>Countdown Timer</h1> */}
      <ul className="count-down mt-35">
        <li>
          {/* <span id="days">{days > 9 ? days : `0${days}`}</span>days */}
        {Math.floor(seconds / (24 * 60 * 60))} days

        </li>
        <li>
          <span id="hours">{hours > 9 ? hours : `0${hours}`}</span>Hours
        </li>
        <li>
          <span id="minutes">{minutes > 9 ? minutes : `0${minutes}`}</span>Minutes
        </li>
        <li>
          <span id="seconds">{seconds > 9 ? seconds : `0${seconds}`}</span>Seconds
        </li>
      </ul>
    </div>
  );
}
