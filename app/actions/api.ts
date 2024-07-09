"use server";

import { cookies } from "next/headers";
import { parseJwt } from "@/app/actions/utils";

export async function getRole() {
  const parsedData = await parseJwt(cookies().get("admin")?.value);
  return parsedData.role;
}

export async function loginAdmin(email: string, password: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/loginAdmin`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        email: email,
        password: password,
      },
      cache: "no-cache",
    });

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function searchAllGuests(token: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/searchAllGuest`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      cache: "no-cache",
    });

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getAvailableRooms(token: string, checkin: Date, checkout: Date) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/getAvailableRooms`, {
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
    });

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function addNewBooking(
  token: string,
  bookingData: {
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
  }
) {
  console.log(bookingData);
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/addBooking`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ bookingData: bookingData }),
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getBookingsByRoom(token: string, room: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/getReserv`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        roomno: room,
        token: token,
      },
      cache: "no-store",
    });

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function addGuest(
  token: string,
  formData: {
    guestEmail: string;
    guestName: string;
    guestPhone: number | null;
    guestCompany: string;
    guestVessel: string;
    guestRank: string;
  }
) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/addGuests`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ guestData: formData }),
      cache: "no-cache",
    });

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editBooking(
  token: string,
  bookingData: {
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
    originalEmail: string;
  }
) {
  console.log(bookingData);
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/editBooking`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ bookingData: bookingData }),
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteBooking(token: string, bookingId: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/deleteBooking`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        bookingid: bookingId,
        token: token,
      },
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getInstantRooms(token: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/instantAvailableRooms`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function addNewRoom(token: string, room: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/addRoom`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ room: room }),
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteRoom(token: string, room: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/deleteRoom`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ room: room }),
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function editEmailTemplate(token: string, template: string, content: string, subject: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/editEmailTempalate`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        template: template,
        content: content,
        subject: subject,
      }),
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getEmailTemplate(token: string, template: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/getEmailTemplate`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        template: template,
      },
      // body: JSON.stringify({template: template, content: content}),
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchRoomData(token: string, currentMonth: string, currentYear: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/analytics/getRoomsBookedPerDay`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        year: currentYear,
        month: currentMonth,
      },
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchMeals(token: string, currentMonth: string, currentYear: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/analytics/getAverageMealsBoughtPerDay`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        year: currentYear,
        month: currentMonth,
      },
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchCompanies(token: string, currentMonth: string, currentYear: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/analytics/getAverageCompanyBookingForMonthandYear`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        year: currentYear,
        month: currentMonth,
      },
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function fetchBreakfast(token: string, currentMonth: string, currentYear: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/analytics/getAverageBreakfastBoughtPerDay`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        year: currentYear,
        month: currentMonth,
      },
      cache: "no-cache",
    });
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchRoomDataQuarter(token: string, currentQuarter: string, currentYear: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/analytics/getRoomsBookedPerDayQuarter`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        year: currentYear,
        quarter: currentQuarter,
      },
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchMealsQuarter(token: string, currentQuarter: string, currentYear: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/analytics/getAverageMealsBoughtPerDayQuarter`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        year: currentYear,
        quarter: currentQuarter,
      },
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchCompaniesQuarter(token: string, currentQuarter: string, currentYear: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/analytics/getAverageCompanyBookingForQuarterandYear`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        year: currentYear,
        quarter: currentQuarter,
      },
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function fetchBreakfastQuarter(token: string, currentQuarter: string, currentYear: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/analytics/getAverageBreakfastBoughtPerDayQuarter`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        year: currentYear,
        quarter: currentQuarter,
      },
      cache: "no-cache",
    });
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchRoomDataYear(token: string, currentYear: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/analytics/getRoomsBookedPerDayYear`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        year: currentYear,
      },
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchMealsYear(token: string, currentYear: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/analytics/getAverageMealsBoughtPerDayYear`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        year: currentYear,
      },
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchCompaniesYear(token: string, currentYear: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/analytics/getAverageCompanyBookingForYear`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        year: currentYear,
      },
      cache: "no-cache",
    });
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function fetchBreakfastYear(token: string, currentYear: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/analytics/getAverageBreakfastBoughtPerDayYear`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        year: currentYear,
      },
      cache: "no-cache",
    });
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function fetchAllCars(token: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/movement/fetchAllCars`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      cache: "no-cache",
    });
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchAllDrivers(token: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/movement/fetchAllDrivers`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      cache: "no-cache",
    });
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function addCar(token: string, name: string, number: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/movement/addCar`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({name: name, number: number}),
      cache: "no-cache",
    });
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function addDriver(token: string, name: string, phone: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/movement/addDriver`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({name: name, phone: phone}),
      cache: "no-cache",
    });
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteCar(token: string, number: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/movement/deleteCar`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        number: number
      },
      cache: "no-cache",
    });
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteDriver(token: string, name: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/movement/deleteDriver`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        name: name
      },
      cache: "no-cache",
    });
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
