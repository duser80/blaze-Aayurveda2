// FloatingActionButton.jsx
import React from "react";

const FloatingActionButton = ({ onClick }) => {
  return (
    <button
      className="fab fixed bottom-[4%] right-[4%] w-16 h-16 rounded-full bg-cyan-500 text-white text-2xl border-none shadow-lg cursor-pointer flex items-center justify-center"
      onClick={onClick}
    >
      +
    </button>
  );
};

export default FloatingActionButton;
