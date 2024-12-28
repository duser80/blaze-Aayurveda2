"use client";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { getEventData, updateDocument, getDocument } from "@/src/utils/get-url";

const EventCard = React.memo(({ event }) => {
  let now = new Date();
  now.setHours(0, 0, 0, 0);

  return (
    <div>
      {event ? (
        event.eventDateTime >= now ? (
          <Link href={`/events/${event._id}`}>
            <div class="max-w-sm rounded overflow-hidden shadow-lg border-white border-2 aspect-square h-25">
              <img
                class="w-full"
                src={event.eventImageUrl}
                alt={event.eventName}
              />
              <div class="px-6 py-4">
                <div class="font-bold text-xl mb-2">{event.eventName}</div>
                <p class="text-base">
                  {event.description.length > 30
                    ? `${event.description.slice(0, 30)}...`
                    : event.description}
                </p>
                <p class="text-base">By : {event.organizedBy}</p>
                <p class="text-base">Created By : {event.creatorName}</p>
                <p class="text-base">Type : {event.type} Event</p>
                <p class="text-base">
                  {/* {new Date(event.eventDateTime).toString()} */}
                  {new Date(event.eventDateTime).toLocaleDateString("en-GB", {
                    timeZone: "Asia/Kolkata",
                  })}{" "}
                  <br />
                  {new Date(event.eventDateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
                <p class="text-base">{event.fees == 0 ? "Free" : event.fees}</p>
              </div>
              {/* HashTags If required in future */}
              {/* Map kar ke use karna hoga db mai hashtag ki array banegi */}
              <div class="px-6 pt-4 pb-2">
                <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #photography
                </span>
                <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #travel
                </span>
                <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #winter
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className=" -m-4"></div>
        )
      ) : null}
    </div>
  );
});

export default EventCard;
