"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getUserData,
  getCollectionData,
  getUserEventsWithDetails,
} from "@/src/utils/get-url";
import EventCard from "@/src/components/EventCard";

const ViewMore = (props) => {
  const router = useRouter();

  // const [eventsData, setEventsData] = useState({
  //   newEvents: [],
  //   trendingEvents: [],
  //   recentEvents: [],
  //   registeredEvents: [],
  //   wishListedEvents: [],
  // });

  const [newEvents, setEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [wishListedEvents, setWishListedEvents] = useState([]);

  // const fetchData = useCallback(async () => {
  //   const userId = localStorage.getItem("id");
  //   const user = await getUserData(userId);
  //   const data = await getCollectionData("events");
  //   const sortedEvents = [...data].sort(
  //     (a, b) => b.event_count - a.event_count
  //   );

  //   setEventsData({
  //     newEvents: data.reverse(),
  //     trendingEvents: sortedEvents,
  //     recentEvents:
  //       user?.recent_events?.sort((a, b) => b.timestamp - a.timestamp) || [],
  //     registeredEvents:
  //       user?.registered_events?.sort((a, b) => b.timestamp - a.timestamp) ||
  //       [],
  //     wishListedEvents:
  //       user?.wishlisted_events?.sort((a, b) => b.timestamp - a.timestamp) || [],
  //   });
  // }, []);

  const fetchData = async () => {
    const { recentEvents, registeredEvents, wishlistedEvents } =
      await getUserEventsWithDetails(localStorage.getItem("id"));
    console.log(recentEvents, "recentEvents");
    if (recentEvents.length > 0) {
      setRecentEvents(recentEvents);
    }
    if (registeredEvents.length > 0) {
      setRegisteredEvents(registeredEvents);
    }
    if (wishlistedEvents.length > 0) {
      setWishListedEvents(wishlistedEvents);
    }
    let data = await getCollectionData("events");
    console.log(data, "data");
    setEvents(data.reverse());
    let Tdata = await getCollectionData("events");
    console.log(Tdata, "data");
    let sortedEvents = Tdata.sort((a, b) => b.event_count - a.event_count);
    console.log(sortedEvents, "sortedEvents");
    setTrendingEvents(sortedEvents);
  };

  useEffect(() => {
    fetchData();
  }, []);

  let events;
  switch (props.searchParams.sectionName) {
    case "New Events":
      events = newEvents || [];
      break;
    case "Trending Events":
      events = trendingEvents || [];
      break;
    case "Recently Visited Events":
      events = recentEvents || [];
      break;
    case "Registered Events":
      events = registeredEvents || [];
      break;
    case "Wish Listed Events":
      events = wishListedEvents || [];
      break;
    default:
      events = [];
  }

  console.log(events, "events");
  return (
    <div>
      <h1 className="text-4xl font-bold p-4 text-center">
        {props.searchParams.sectionName}
      </h1>
      <div className="event-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ">
        {events.map((event) => (
          <EventCard event={event} />
        ))}
      </div>
    </div>
  );
};

export default ViewMore;
