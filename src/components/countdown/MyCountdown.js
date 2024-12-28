import { useCountdown } from "./countdownfun";
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 20);

const MyCountdown = () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 20);
  
    const [days, hours, minutes, seconds] = useCountdown(targetDate);
  
    return (
      <ul className="count-down mt-35">
        <li>
          <span id="days">{days > 9 ? days : `0${days}`}</span>days
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
    );
  };
  export default MyCountdown;