import React from "react";

const eventDetails = [
  {
    date: "12/12/12",
    eventName: "Do Hazar Barah",
    registrations: 2000,
    attendees: 12,
    profit: 12000,
    engagement: 202012,
  },
  {
    date: "13/12/12",
    eventName: "Event 2",
    registrations: 1500,
    attendees: 10,
    profit: 9000,
    engagement: 150000,
  },
  {
    date: "14/12/12",
    eventName: "Event 3",
    registrations: 1800,
    attendees: 15,
    profit: 11000,
    engagement: 180000,
  },
  {
    date: "13/12/12",
    eventName: "Event 2",
    registrations: 1500,
    attendees: 10,
    profit: 9000,
    engagement: 150000,
  },
  {
    date: "14/12/12",
    eventName: "Event 3",
    registrations: 1800,
    attendees: 15,
    profit: 11000,
    engagement: 180000,
  },
  {
    date: "13/12/12",
    eventName: "Event 2",
    registrations: 1500,
    attendees: 10,
    profit: 9000,
    engagement: 150000,
  },
  {
    date: "14/12/12",
    eventName: "Event 3",
    registrations: 1800,
    attendees: 15,
    profit: 11000,
    engagement: 180000,
  },
  {
    date: "13/12/12",
    eventName: "Event 2",
    registrations: 1500,
    attendees: 10,
    profit: 9000,
    engagement: 150000,
  },
  {
    date: "14/12/12",
    eventName: "Event 3",
    registrations: 1800,
    attendees: 15,
    profit: 11000,
    engagement: 180000,
  },
  {
    date: "13/12/12",
    eventName: "Event 2",
    registrations: 1500,
    attendees: 10,
    profit: 9000,
    engagement: 150000,
  },
  {
    date: "14/12/12",
    eventName: "Event 3",
    registrations: 1800,
    attendees: 15,
    profit: 11000,
    engagement: 180000,
  },
  {
    date: "13/12/12",
    eventName: "Event 2",
    registrations: 1500,
    attendees: 10,
    profit: 9000,
    engagement: 150000,
  },
  {
    date: "14/12/12",
    eventName: "Event 3",
    registrations: 1800,
    attendees: 15,
    profit: 11000,
    engagement: 180000,
  },
  {
    date: "13/12/12",
    eventName: "Event 2",
    registrations: 1500,
    attendees: 10,
    profit: 9000,
    engagement: 150000,
  },
  {
    date: "14/12/12",
    eventName: "Event 3",
    registrations: 1800,
    attendees: 15,
    profit: 11000,
    engagement: 180000,
  },
];

const EventTable = () => {
  return (
    <div className=" p-4 rounded-lg shadow-md mb-4 max-h-64 overflow-y-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-blue-800 ">
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Event Name</th>
            <th className="px-4 py-2">Registrations</th>
            <th className="px-4 py-2">Attendees</th>
            <th className="px-4 py-2">Profit</th>
            <th className="px-4 py-2">Engagement</th>
          </tr>
        </thead>
        <tbody>
          {eventDetails.map((event, index) => (
            <tr key={index} className="even:bg-blue-700 odd:bg-blue-900">
              <td className="border px-4 py-2">{event.date}</td>
              <td className="border px-4 py-2">{event.eventName}</td>
              <td className="border px-4 py-2">{event.registrations}</td>
              <td className="border px-4 py-2">{event.attendees}</td>
              <td className="border px-4 py-2">{event.profit}</td>
              <td className="border px-4 py-2">{event.engagement}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
