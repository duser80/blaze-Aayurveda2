"use client";
import React from "react";
import Image from "next/image";
import CardDataStats from "../../components/card";
import EyeIcon from "./assets/eye";
import CartIcon from "./assets/cart";
import ShoppingBagIcon from "./assets/shopingbag";
import PeopleIcon from "./assets/people";

const cardData = [
  {
    title: "Total views",
    total: "$3.456K",
    rate: "0.43%",
    level: "up",
    Icon: EyeIcon,
  },
  {
    title: "Total Profit",
    total: "$45,2K",
    rate: "4.35%",
    level: "up",
    Icon: CartIcon,
  },
  {
    title: "Total Product",
    total: "2.450",
    rate: "2.59%",
    level: "up",
    Icon: ShoppingBagIcon,
  },
  {
    title: "Total Users",
    total: "3.456",
    rate: "0.95%",
    level: "down",
    Icon: PeopleIcon,
  },
];

const Dashboard = () => {
  return (
    <div className=" mt-4 mb-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {cardData.map((card, index) => (
          <CardDataStats
            key={index}
            title={card.title}
            total={card.total}
            rate={card.rate}
            levelUp={card.level === "up"}
            levelDown={card.level === "down"}
          >
            <card.Icon />
          </CardDataStats>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* space for adding charts */}
      </div>
    </div>
  );
};

export default Dashboard;
