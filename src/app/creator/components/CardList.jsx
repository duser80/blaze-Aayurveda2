import React from "react";
import CardDataStats from "../../../components/card";
import EyeIcon from "../assets/eye";
import CartIcon from "../assets/cart";
import ShoppingBagIcon from "../assets/shopingbag";
import PeopleIcon from "../assets/people";

const cardData = [
  {
    title: "Total Unique Registrations",
    total: "3.456",
    rate: "0.95%",
    level: "down",
    Icon: PeopleIcon,
  },
  {
    title: "Total Average Registrations",
    total: "3.456",
    rate: "0.95%",
    level: "down",
    Icon: PeopleIcon,
  },
  {
    title: "Average Number of Attendees",
    total: "3.456",
    rate: "0.95%",
    level: "down",
    Icon: PeopleIcon,
  },
  {
    title: "Total Unique Attendees",
    total: "3.456",
    rate: "0.95%",
    level: "down",
    Icon: PeopleIcon,
  },
  {
    title: "Net Revenue",
    total: "$45,2K",
    rate: "4.35%",
    level: "up",
    Icon: CartIcon,
  },
  {
    title: "Total Profit Generated",
    total: "$45,2K",
    rate: "4.35%",
    level: "up",
    Icon: CartIcon,
  },
  {
    title: "Total Impressions",
    total: "$3.456K",
    rate: "0.43%",
    level: "up",
    Icon: EyeIcon,
  },
  {
    title: "Total Redirections to Seller",
    total: "2.450",
    rate: "2.59%",
    level: "up",
    Icon: ShoppingBagIcon,
  },
];

const CardList = () => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="p-4 flex items-center gap-4 bg-blue-700 text-white shadow-md rounded-lg"
        >
          <card.Icon className="w-8 h-8" />
          <div>
            <h3 className="font-semibold text-sm sm:text-md lg:text-lg">
              {card.title}
            </h3>
            <p className="text-md sm:text-lg lg:text-xl">{card.total}</p>
            <p
              className={`text-sm ${
                card.level === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {card.rate} {card.level === "up" ? "↑" : "↓"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardList;
