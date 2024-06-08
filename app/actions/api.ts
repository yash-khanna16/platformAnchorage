"use server";

import { cookies } from "next/headers";
import { parseJwt } from "@/app/actions/utils";

export async function getRole(){
  const parsedData = await parseJwt(cookies().get("admin")?.value);
  return parsedData.role;
}

export async function loginAdmin(email: string, password: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/loginAdmin`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          email: email,
          password: password,
        },
        cache: "no-cache",
      }
    );

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function searchAllGuests(token:string, guest: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/searchAllGuest`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          guestname: guest,
          token: token,
        },
        cache: "no-cache",
      }
    );

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getAvailableRooms(token:string, checkin: Date, checkout: Date) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/getAvailableRooms`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          checkData: { checkin: checkin, checkout: checkout },
        }),
        cache: "no-cache",
      }
    );

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function addNewBooking(token:string, bookingData: {
  checkin: Date;
  checkout: Date;
  email: string;
  meal_veg: number;
  meal_non_veg: number;
  remarks: string;
  additional: string;
  room: string;
  name: string;
  phone: number;
  company: string;
  vessel: string;
  rank: string;
  breakfast: number;
}) {
  console.log(bookingData);
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/addBooking`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ bookingData: bookingData }),
        cache: "no-cache",
      }
    );
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getBookingsByRoom(token:string, room: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/getReserv`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          roomno: room,
          token: token,
        },
        cache: "no-store",
      }
    );

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function addGuest(token:string, formData: {
  guestEmail: string;
  guestName: string;
  guestPhone: number | null;
  guestCompany: string;
  guestVessel: string;
  guestRank: string;
}) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/addGuests`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ guestData: formData }),
        cache: "no-cache",
      }
    );

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editBooking(token:string, bookingData: {
  bookingId: string;
  checkin: Date;
  checkout: Date;
  email: string;
  meal_veg: number;
  meal_non_veg: number;
  remarks: string;
  additional: string;
  room: string;
  name: string;
  phone: number;
  company: string;
  vessel: string;
  rank: string;
  breakfast: number;
}) {
  console.log(bookingData);
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/editBooking`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ bookingData: bookingData }),
        cache: "no-cache",
      }
    );
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteBooking(token:string, bookingId: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/deleteBooking`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          bookingid: bookingId,
          token: token,
        },
        cache: "no-cache",
      }
    );
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getInstantRooms(token:string, ) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/instantAvailableRooms`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        cache: "no-cache",
      }
    );
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function addNewRoom(token:string, room: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/addRoom`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({room: room}),
        cache: "no-cache",
      }
    );
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteRoom(token:string, room: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/deleteRoom`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({room: room}),
        cache: "no-cache",
      }
    );
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchRoomData(token:string) {
  return true;
  // try {
  //   const response = await fetch(
  //     `${process.env.BACKEND_URL}/api/admin/ghaphData`,
  //     {
  //       method: "get",
  //       mode: "cors",
  //       headers: {
  //         "Content-Type": "application/json",
  //         token: token,
  //       },
  //       cache: "no-cache",
  //     }
  //   );
  //   const data = await response.json(); // Parse the JSON response
  //   return data;
  // } catch (error) {
  //   console.log(error);
  //   throw error;
  // }
}
export async function fetchMeals(token:string) {
  return true;
  // try {
  //   const response = await fetch(
  //     `${process.env.BACKEND_URL}/api/admin/ghaphData`,
  //     {
  //       method: "get",
  //       mode: "cors",
  //       headers: {
  //         "Content-Type": "application/json",
  //         token: token,
  //       },
  //       cache: "no-cache",
  //     }
  //   );
  //   const data = await response.json(); // Parse the JSON response
  //   return data;
  // } catch (error) {
  //   console.log(error);
  //   throw error;
  // }
}
export async function fetchCompanies(token:string) {
  return true;
  // try {
  //   const response = await fetch(
  //     `${process.env.BACKEND_URL}/api/admin/ghaphData`,
  //     {
  //       method: "get",
  //       mode: "cors",
  //       headers: {
  //         "Content-Type": "application/json",
  //         token: token,
  //       },
  //       cache: "no-cache",
  //     }
  //   );
  //   const data = await response.json(); // Parse the JSON response
  //   return data;
  // } catch (error) {
  //   console.log(error);
  //   throw error;
  // }
}
