import React from "react";

const DownIcon = ({ className = "" }) => (
  <svg
    className={`fill-meta-5 ${className}`} // Utilize className prop for external customization
    width="10"
    height="11"
    viewBox="0 0 10 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
      fill="#ff474c" // Set fill to "currentColor" to inherit color from parent
    />
  </svg>
);

export default DownIcon;
