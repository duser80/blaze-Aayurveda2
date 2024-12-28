import React, { useEffect, useState } from "react";

const Countdown = () => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 20); // Set target date to 20 days from now
  console.log("Target Date:", targetDate); // Debugging

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      console.log("Time Left (ms):", newTimeLeft.total); // Debugging
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [newTimeLeft]);

  return (
    <ul className="count-down mt-35">
      <li>
        <span id="days">{timeLeft.days > 9 ? timeLeft.days : `0${timeLeft.days}`}</span>days
      </li>
      <li>
        <span id="hours">{timeLeft.hours > 9 ? timeLeft.hours : `0${timeLeft.hours}`}</span>Hours
      </li>
      <li>
        <span id="minutes">{timeLeft.minutes > 9 ? timeLeft.minutes : `0${timeLeft.minutes}`}</span>Minutes
      </li>
      <li>
        <span id="seconds">{timeLeft.seconds > 9 ? timeLeft.seconds : `0${timeLeft.seconds}`}</span>Seconds
      </li>
    </ul>
  );
};

// Helper function to calculate time left
const calculateTimeLeft = (targetDate) => {
  const now = new Date().getTime();
  const countDown = targetDate.getTime() - now;

  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return { total: countDown, days, hours, minutes, seconds };
};

export default Countdown;
