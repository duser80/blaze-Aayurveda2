import React from "react";
import CardList from "./components/CardList";
import EventTable from "./components/EventTable";
import ChartGrid from "./components/ChartGrid";

const Dashboard = () => {
  return (
    <div className="p-4 sm:p-8 flex flex-col lg:flex-row gap-4">
      {/* <div className="lg:w-1/4 flex-shrink-0  p-4 rounded-lg shadow-md"></div> */}
      <div className="w-full flex flex-col gap-4">
        <CardList />
        <EventTable />
        <ChartGrid />
      </div>
    </div>
  );
};

export default Dashboard;
