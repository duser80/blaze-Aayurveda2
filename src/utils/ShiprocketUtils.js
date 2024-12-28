"use server";
import { v4 as uuidv4 } from "uuid";

const getShipRocketToken = async () => {
  const response = await fetch(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      method: "POST",
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH",
      },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_API_EMAIL,
        password: process.env.SHIPROCKET_API_PASS,
      }),
    }
  );

  if (!response.ok) {
    console.log(response, "response");
    return;
  }

  const data = await response.json();
  return data.token;
};

export const createShipRocketOrderServer = async (
  response,
  address,
  email,
  phoneNumber,
  subtotal,
  discount,
  orderItems,
  cod,
  length,
  breadth,
  height,
  weight
) => {
  try {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    const token = await getShipRocketToken();

    const orderId = response?.razorpay_order_id || `ORDER_${uuidv4()}`;

    const orderData = {
      order_id: orderId,
      order_date: formattedDate,
      pickup_location: "Primary",
      billing_customer_name: address.firstName,
      billing_last_name: address.lastName,
      billing_address: address.houseNumber,
      billing_address_2: address.addressLine,
      billing_isd_code: "+91",
      billing_city: address.city,
      billing_pincode: address.zipCode,
      billing_state: address.state,
      billing_country: address.country,
      billing_email: email,
      billing_phone: phoneNumber,
      shipping_is_billing: true,
      shipping_customer_name: address.firstName,
      shipping_last_name: address.lastName,
      shipping_address: address.houseNumber,
      shipping_address_2: address.addressLine,
      shipping_city: address.city,
      shipping_pincode: address.zipCode,
      shipping_country: address.country,
      shipping_state: address.state,
      shipping_email: email,
      shipping_phone: phoneNumber,
      order_items: orderItems,
      payment_method: cod == 1 ? "COD" : "Prepaid",
      sub_total: subtotal,
      length: length,
      breadth: breadth,
      height: height,
      weight: weight,
    };

    // Log the order data being sent to ShipRocket
    console.log(
      "Sending order data to ShipRocket:",
      JSON.stringify(orderData, null, 2)
    );

    const ShipRocketResponse = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      }
    );

    const responseData = await ShipRocketResponse.json();

    if (!ShipRocketResponse.ok) {
      console.error("ShipRocket API Error:", {
        status: ShipRocketResponse.status,
        statusText: ShipRocketResponse.statusText,
        responseData,
      });

      if (ShipRocketResponse.status === 422) {
        console.error(
          "Validation errors:",
          responseData.errors || "No specific errors provided"
        );
        throw new Error(
          "Invalid data sent to ShipRocket API. Please check the order details."
        );
      }

      throw new Error(
        `ShipRocket API error: ${ShipRocketResponse.status} ${ShipRocketResponse.statusText}`
      );
    }

    return responseData;
  } catch (error) {
    console.error("Error in createShipRocketOrderServer:", error);
    throw error;
  }
};

export const downloadInvoiceServer = async (id) => {
  const token = await getShipRocketToken();

  const response = await fetch(
    `https://apiv2.shiprocket.in/v1/external/orders/print/invoice`,
    {
      method: "POST",
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH",
        Authorization: `Bearer ${token}`,
        credentials: "include",
      },
      body: JSON.stringify({
        ids: [id],
      }),
    }
  );

  if (!response.ok) {
    console.log(response, "response");
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
  return data;
};

export const isServiceable = async (
  zipCode,
  cod,
  length,
  breadth,
  height,
  weight
) => {
  console.log(zipCode, cod, length, breadth, height, weight);
  console.log(
    `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=452001&cod=${cod}&length=${length}&breadth=${breadth}&height=${height}&weight=${weight}&delivery_postcode=${zipCode}`
  );
  const token = await getShipRocketToken();
  const response = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=452001&cod=${cod}&length=${length}&breadth=${breadth}&height=${height}&weight=${weight}&delivery_postcode=${zipCode}`,
    {
      method: "GET",
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH",
        Authorization: `Bearer ${token}`,
        credentials: "include",
      },
    }
  );

  if (!response.ok) {
    console.log(response, "response");
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const createAWB = async (shipment_id, courier_id) => {
  const token = await getShipRocketToken();
  const response = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/assign/awb`,
    {
      method: "POST",
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH",
        Authorization: `Bearer ${token}`,
        credentials: "include",
      },
      body: JSON.stringify({
        courier_id: courier_id,
        shipment_id: shipment_id,
      }),
    }
  );

  if (!response.ok) {
    console.log(response, "response");
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
