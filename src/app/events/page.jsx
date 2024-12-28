"use client";
import React, { useState, useEffect, useCallback } from "react";
import ScrollableSection from "../../components/Section";
import SearchBar from "../../components/SearchBar";
import FloatingActionButton from "../../components/FloatingActionButton";
import { redirect, useRouter } from "next/navigation";
import {
  getCollectionData,
  getRecentEventsWithDetails,
  getUserData,
  getUserEventsWithDetails,
} from "@/src/utils/get-url";
import Link from "next/link";

const EventGrid = React.memo(({ events }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    const fetchedUsers = await Promise.all(
      events.map((event) => getUserData(event.creatorId))
    );
    setUsers(fetchedUsers);
  }, [events]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="event-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ">
      {events.map((event, index) => (
        <Link href={`/events/${event._id}`}>
          <div className="max-w-sm rounded overflow-hidden shadow-lg border-white border-2">
            <img
              className="w-full"
              src={event.eventImageUrl}
              alt={event.eventName}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{event.eventName}</div>
              <p className="text-base">{event.description}</p>
              <p className="text-base">By : {event.organizedBy}</p>
              <p className="text-base">Created By : {users[index]?.name}</p>
              <p className="text-base">Type : {event.type} Event</p>
              <p className="text-base">
                {event.eventDateTime.toLocaleDateString("en-GB")} <br />
                {event.eventDateTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
              </p>
              <p className="text-base">
                {event.fees == 0 ? "Free" : event.fees}
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #photography
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #travel
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #winter
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
});

const Banner = React.memo(({ events }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % events.length);
    }, 3000); // Change event every 3 seconds

    return () => clearInterval(timer);
  }, [events]);

  return (
    <Link href={`/events/${events[current]._id}`} className=" ">
      <div className="px-2 py-2 mx-auto max-w-7xl sm:px-6 md:px-6 lg:px-12 lg:py-12 bg-slate-700">
        <div className="flex flex-wrap items-center mx-auto max-w-7xl">
          <div className="w-full lg:max-w-lg lg:w-1/2 rounded-xl">
            <div>
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 rounded-full bg-violet-300 -left-4 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>

                <div className="absolute rounded-full bg-fuchsia-300 -bottom-24 right-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <img
                    className="flex-1 justify-center object-fill resize self-center"
                    src={events[current].eventImageUrl}
                    alt={events[current].eventName}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start mt-12 mb-16 text-left lg:flex-grow lg:w-1/2 lg:pl-6 xl:pl-24 md:mb-0 xl:mt-0">
            <span className="mb-8 text-4xl font-bold leading-none tracking-tighter text-white md:text-7xl lg:text-5xl">
              {" "}
              {events[current].eventName}{" "}
            </span>
            <h1 className="mb-8 text-xl font-bold tracking-widest text-blue-600 uppercase">
              {events[current].eventDateTime.toLocaleDateString("en-GB")}
            </h1>
            <h1 className="mb-8 text-xl font-bold tracking-widest text-blue-600 uppercase">
              {events[current].eventDateTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h1>
            <h1 className="mb-8 text-xl font-bold tracking-widest text-white uppercase">
              Price :{" "}
              {events[current].fees == 0 ? "Free" : events[current].fees}
            </h1>
            <p className="mb-8 text-base leading-relaxed text-left text-gray-500">
              {events[current].description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
});

const Section = React.memo(({ events, sectionName }) => {
  return (
    <div className=" m-4">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold p-4">{sectionName}</h1>
        <Link
          href={{
            pathname: "/events/viewMore",
            query: {
              sectionName: sectionName,
            },
          }}
        >
          <div className="text-2xl font-bold p-4">View More</div>
        </Link>
      </div>
      <ScrollableSection type={"eventSection"} items={events} />
    </div>
  );
});

const EventPage = () => {
  const router = useRouter();

  function sortDescending(a, b) {
    return b.timestamp - a.timestamp;
  }

  const [isSearchBarActive, setIsSearchBarActive] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const [newEvents, setEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [wishListedEvents, setWishListedEvents] = useState([]);

  useEffect(() => {
    console.log(filteredEvents, "filteredEvents");
  }, [filteredEvents]);

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
    console.log(newEvents, "newEvents");
  }, [newEvents]);
  useEffect(() => {
    console.log(trendingEvents, "trendingEvents");
  }, [trendingEvents]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
      if (!localStorage.getItem("id")) {
        redirect("/signin");
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {newEvents ? (
        <div className=" h-full w-full">
          <SearchBar
            events={newEvents}
            isActive={isSearchBarActive}
            setIsActive={setIsSearchBarActive}
            filteredEvents={filteredEvents}
            setFilteredEvents={setFilteredEvents}
          />
          {isSearchBarActive ? (
            <EventGrid events={filteredEvents} />
          ) : (
            <div>
              {newEvents.length == 0 ? null : (
                <Banner events={newEvents.filter((_, i) => i < 5)} />
              )}
              {wishListedEvents?.length != 0 ? (
                <Section
                  events={wishListedEvents}
                  sectionName="Wish Listed Events"
                />
              ) : null}
              {recentEvents?.length != 0 ? (
                <Section
                  events={recentEvents}
                  sectionName="Recently Visited Events"
                />
              ) : null}
              {registeredEvents?.length != 0 ? (
                <Section
                  events={registeredEvents}
                  sectionName="Registered Events"
                />
              ) : null}
              {trendingEvents?.length != 0 ? (
                <Section
                  events={trendingEvents}
                  sectionName="Trending Events"
                />
              ) : null}
              {newEvents?.length != 0 ? (
                <Section events={newEvents} sectionName="New Events" />
              ) : null}
              {/* <EventGrid events={events} /> */}
            </div>
          )}
          {role === "creator" ? (
            <FloatingActionButton
              onClick={() => {
                router.push("/createEvent");
              }}
            />
          ) : null}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default EventPage;
