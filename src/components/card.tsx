"use client";
import React, { ReactNode } from "react";
import DownIcon from "../app/seller/assets/Down";
import UpIcon from "../app/seller/assets/Up";

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="flex flex-col rounded-xl border bg-blue-900 px-7.5 py-2 border-white">
      <div className="flex h-5 w-12 items-center self-center justify-center rounded-full bg-meta-4">
        {children}
      </div>

      <div className="m-4 flex items-end justify-between">
        <div>
          <h4 className="text-xl font-bold text-white">{total}</h4>
          <span className="text-sm font-medium">{title}</span>
        </div>

        <span
          className={`flex items-center gap-1 text-lg font-medium ${
            levelUp && "text-[lightgreen]"
          } ${levelDown && "text-[#ff474c]"} `}
        >
          {rate}
          {levelUp && <UpIcon />}
          {levelDown && <DownIcon />}
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;
