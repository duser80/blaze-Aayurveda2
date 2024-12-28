"use client";
// ScrollableSection.jsx
import React from "react";
import EventCard from "./EventCard";
// import ProductCard from "./ProductCard";
import ProductCard1 from "./productcard1";

const ScrollableSection = ({ type, items }) => {
  return (
    <div
      className="  m-2 h-auto overflow-x-auto w-36 hide-scrollbar"
      style={{ minWidth: "-webkit-fill-available" }}
    >
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
      <div className="flex space-x-4" style={{ width: "max-content" }}>
        {items.map((item, index) => (
          <div className=" max-w-max">
            {type === "eventSection" ? (
              <EventCard event={item} />
            ) : (
              // <ProductCard product={item} />
              <ProductCard1 data={item} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollableSection;
