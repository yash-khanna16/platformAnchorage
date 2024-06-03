"use server";

export async function loginAdmin(email: string, password: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/loginAdmin`,
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
export async function searchAllGuests(guest: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/searchAllGuest`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          guestname: guest,
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
export async function getAvailableRooms(checkin: Date, checkout: Date) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/getAvailableRooms`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
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
export async function addNewBooking(bookingData: {
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

export async function getBookingsByRoom(room: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/getReserv`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          roomno: room,
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
export async function addGuest(formData: {
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

export async function editBooking(bookingData: {
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
export async function deleteBooking(bookingId: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/deleteBooking`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          bookingid: bookingId
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
export async function getInstantRooms() {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/instantAvailableRooms`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
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
