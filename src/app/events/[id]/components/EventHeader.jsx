"use client";
import React, { useState, useEffect } from "react";

// Function to render header from event name
export default function EventHeader(event) {
  return (
    <h2 className="mb-8 text-3xl font-bold leading-tight text-white dark:text-black sm:text-4xl sm:leading-tight">
      {event.eventName}
    </h2>
  );
}
