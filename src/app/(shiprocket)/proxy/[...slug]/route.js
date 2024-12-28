// app/proxy/[...slug]/route.js

import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const path = params.slug.join("/");
  const url = `https://apiv2.shiprocket.in/v1/${path}`;

  // For debugging: return the constructed URL
  // return NextResponse.json({ url });
  // return NextResponse.json({ body: await request.json() });

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH",
        "Authorization": `Bearer ${process.env.SHIPROCKET_API_KEY}`,
        "credentials": "include",
      },
      // body: await request.json(),
    });

    // return NextResponse.json({ response });

    if (!response.ok) {
      return NextResponse.json(
        { error: "API request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
