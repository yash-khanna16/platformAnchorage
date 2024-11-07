"use server";

import { cookies } from "next/headers";
import { parseJwt } from "@/app/actions/utils";
import loadConfig from "@/config/config";
import { CleaningServices } from "@mui/icons-material";

export async function getRole() {
  const parsedData = await parseJwt(cookies().get("admin")?.value);
  return parsedData.role;
}

export async function loginAdmin(email: string, password: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/loginAdmin`, {
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
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/searchAllGuest`, {
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
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/getAvailableRooms`, {
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
    phone: string;
    company: string;
    vessel: string;
    rank: string;
    breakfast: number;
  }
) {
  console.log(bookingData);
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/addBooking`, {
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
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/getReserv`, {
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
    guestPhone: string | null;
    guestCompany: string;
    guestVessel: string;
    guestRank: string;
    guestId: string;
  }
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/addGuests`, {
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
    phone: string;
    company: string;
    vessel: string;
    rank: string;
    breakfast: number;
    originalEmail: string;
  }
) {
  console.log(bookingData);
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/editBooking`, {
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
export async function deleteBooking(token: string, bookingId: string, password: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/deleteBooking`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        bookingid: bookingId,
        token: token,
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
export async function getInstantRooms(token: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/instantAvailableRooms`, {
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
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/addRoom`, {
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
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/deleteRoom`, {
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
export async function editEmailTemplate(
  token: string,
  template: string,
  content: string,
  subject: string
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/editEmailTempalate`, {
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
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/getEmailTemplate`, {
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
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/analytics/getRoomsBookedPerDay`, {
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
    const secret = await loadConfig();
    const response = await fetch(
      `${secret.BACKEND_URL}/api/analytics/getAverageMealsBoughtPerDay`,
      {
        method: "get",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          year: currentYear,
          month: currentMonth,
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
export async function fetchCompanies(token: string, currentMonth: string, currentYear: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(
      `${secret.BACKEND_URL}/api/analytics/getAverageCompanyBookingForMonthandYear`,
      {
        method: "get",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          year: currentYear,
          month: currentMonth,
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

export async function fetchBreakfast(token: string, currentMonth: string, currentYear: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(
      `${secret.BACKEND_URL}/api/analytics/getAverageBreakfastBoughtPerDay`,
      {
        method: "get",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          year: currentYear,
          month: currentMonth,
        },
        cache: "no-cache",
      }
    );
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchRoomDataQuarter(
  token: string,
  currentQuarter: string,
  currentYear: string
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(
      `${secret.BACKEND_URL}/api/analytics/getRoomsBookedPerDayQuarter`,
      {
        method: "get",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          year: currentYear,
          quarter: currentQuarter,
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
export async function fetchMealsQuarter(
  token: string,
  currentQuarter: string,
  currentYear: string
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(
      `${secret.BACKEND_URL}/api/analytics/getAverageMealsBoughtPerDayQuarter`,
      {
        method: "get",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          year: currentYear,
          quarter: currentQuarter,
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
export async function fetchCompaniesQuarter(
  token: string,
  currentQuarter: string,
  currentYear: string
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(
      `${secret.BACKEND_URL}/api/analytics/getAverageCompanyBookingForQuarterandYear`,
      {
        method: "get",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          year: currentYear,
          quarter: currentQuarter,
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

export async function fetchBreakfastQuarter(
  token: string,
  currentQuarter: string,
  currentYear: string
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(
      `${secret.BACKEND_URL}/api/analytics/getAverageBreakfastBoughtPerDayQuarter`,
      {
        method: "get",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          year: currentYear,
          quarter: currentQuarter,
        },
        cache: "no-cache",
      }
    );
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
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/analytics/getRoomsBookedPerDayYear`, {
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
    const secret = await loadConfig();
    const response = await fetch(
      `${secret.BACKEND_URL}/api/analytics/getAverageMealsBoughtPerDayYear`,
      {
        method: "get",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          year: currentYear,
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
export async function fetchCompaniesYear(token: string, currentYear: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(
      `${secret.BACKEND_URL}/api/analytics/getAverageCompanyBookingForYear`,
      {
        method: "get",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          year: currentYear,
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

export async function fetchBreakfastYear(token: string, currentYear: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(
      `${secret.BACKEND_URL}/api/analytics/getAverageBreakfastBoughtPerDayYear`,
      {
        method: "get",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          year: currentYear,
        },
        cache: "no-cache",
      }
    );
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
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/movement/fetchAllCars`, {
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
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/movement/fetchAllDrivers`, {
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
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/movement/addCar`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ name: name, number: number }),
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
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/movement/addDriver`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ name: name, phone: phone }),
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
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/movement/deleteCar`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        number: number,
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
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/movement/deleteDriver`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        name: name,
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

export async function addMovement(
  token: string,
  movementData: {
    pickup_location: string;
    pickup_time: Date;
    return_time: Date;
    drop_location: string;
    driver: string;
    car_number: string;
    passengers: {
      bookingId?: string | null;
      passengerName?: string;
      phoneNumber?: string;
      remark?: string;
      company?: string;
    }[];
  }
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/movement/addMovement`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        pickup_location: movementData.pickup_location,
        pickup_time: movementData.pickup_time,
        return_time: movementData.return_time,
        drop_location: movementData.drop_location,
        driver: movementData.driver,
        car_number: movementData.car_number,
        passengers: movementData.passengers,
      }),
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

export async function fetchAvailableCars(
  token: string,
  pickUpDateTime: string,
  returnDateTime: string
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/movement/fetchAvailableCars`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        pickuptime: pickUpDateTime,
        returntime: returnDateTime,
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
export async function fetchAvailableDrivers(
  token: string,
  pickUpDateTime: string,
  returnDateTime: string
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/movement/fetchAvailableDrivers`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        pickuptime: pickUpDateTime,
        returntime: returnDateTime,
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
export async function fetchMovement(token: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/movement/fetchMovement`, {
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

export async function fetchMasterMovement(token: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/movement/fetchEachPassenger`, {
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

export async function editMovement(
  token: string,
  apiData: {
    movement_id: string;
    pickup_time: Date;
    return_time: Date;
    driver: string;
    car_number: string;
    pickup_location: string;
    drop_location: string;
    passengers: {
      booking_id: any;
      passenger_id: any;
      remark: any;
      name: any;
      phone: any;
      company: any;
    }[];
  }
) {
  console.log(apiData);
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/movement/editMovement`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        movement_id: apiData.movement_id,
        pickup_time: apiData.pickup_time,
        return_time: apiData.return_time,
        driver: apiData.driver,
        car_number: apiData.car_number,
        pickup_location: apiData.pickup_location,
        drop_location: apiData.drop_location,
        passengers: apiData.passengers,
      }),
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
export async function deletePassenger(
  token: string,
  movement_id: string,
  passenger_id: string,
  password: string
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/movement/deletePassengerFromMovement`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        movementid: movement_id,
        passengerid: passenger_id,
        password: password,
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
export async function deleteMovementByMovementId(
  token: string,
  movement_id: string,
  password: string
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(
      `${secret.BACKEND_URL}/api/movement/deleteMovementFromMovementId`,
      {
        method: "get",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          movementid: movement_id,
          password: password,
        },
        cache: "no-cache",
      }
    );
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchMealsByDate(token: string, date: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/fetchMealsByDate`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        date: date,
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

export async function updateMeals(
  token: string,
  body: {
    booking_id: string;
    date: string;
    breakfast_veg: number;
    breakfast_nonveg: number;
    lunch_veg: number;
    lunch_nonveg: number;
    dinner_veg: number;
    dinner_nonveg: number;
  }[]
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/updateMeals`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(body),
      cache: "no-cache",
    });
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      console.log("error updating meals ", data);
      throw new Error("Internal Server Error!");
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchMealsByBookingId(token: string, bookingId: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/fetchMealsByBookingId`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        bookingid: bookingId,
      },
      cache: "no-cache",
    });
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      console.log("error fetching meals ", data);
      throw new Error("Internal Server Error!");
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchMovementByBookingId(token: string, bookingId: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/movement/fetchMovementByBookingId`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        bookingid: bookingId,
      },
      cache: "no-cache",
    });
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      console.log("error fetching movement ", data);
      throw new Error("Internal Server Error!");
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchOccupancyByBookingId(token: string, bookingId: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/fetchOccupancyByBooking`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        bookingid: bookingId,
      },
      cache: "no-cache",
    });
    // console.log("res: ", response);
    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      console.log("error fetching occupancy ", data);
      throw new Error("Internal Server Error!");
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function fetchBookingLogs(token: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/fetchBookingLogs`, {
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
export async function fetchAuditLogs(token: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/fetchAuditLog`, {
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

export async function fetchAllOrders(token: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/cos/fetchAllOrders`, {
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
export async function deleteOrder(token: string, orderId: string, reason: string, reject: boolean) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/cos/deleteOrder`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        orderId: orderId,
        reason: reason,
        reject: reject.toString(),
      },
      cache: "no-cache",
    });

    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      throw new Error("Error deleting, " + data);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchAllItems(token: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/cos/fetchAllItems`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      cache: "no-cache",
    });

    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      throw new Error("Error fetching items, " + data);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function putItem(
  token: string,
  itemDetails: {
    available: boolean;
    category: string;
    description: string;
    item_id: string;
    name: string;
    price: number;
    time_to_prepare: number;
    type: string;
  }
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/cos/putItem`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ itemDetails: itemDetails }),
      cache: "no-cache",
    });

    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      throw new Error("Error adding items, " + data);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteItem(token: string, itemid: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/cos/deleteItem`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        itemid: itemid,
      },
      cache: "no-cache",
    });

    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      throw new Error("Error deleting items, " + data);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateItem(
  token: string,
  itemDetails: {
    available: boolean;
    category: string;
    description: string;
    item_id: string;
    name: string;
    price: number;
    time_to_prepare: number;
    type: string;
  }
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/cos/updateItem`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ itemDetails: itemDetails }),
      cache: "no-cache",
    });

    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      throw new Error("Error updating item " + data);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function updateOrderStatus(token: string, orderId: string, status: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/cos/updateOrderStatus`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        orderid: orderId,
        status: status,
      },
      cache: "no-cache",
    });

    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      throw new Error("Error updating status" + data);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function updateDelay(token: string, orderId: string, delay: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/cos/updateDelay`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        orderid: orderId,
        delay: delay,
      },
      cache: "no-cache",
    });

    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      throw new Error("Error updating delay" + data);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchProfitData(token: string, currentQuarter: string, currentYear: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/analytics/getTotalProfitePerDay`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
        year: currentYear,
        month: currentQuarter,
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
export async function fetchProfitDataQuarter(
  token: string,
  currentQuarter: string,
  currentYear: string
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/analytics/getTotalProfitePerQuarter`, {
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
export async function fetchProfitDataYear(token: string, currentYear: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/analytics/getTotalProfitPerYear`, {
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
export async function fetchAllFeedback(token: string) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/fetchAllFeedback`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      cache: "no-cache",
    });

    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      throw new Error("Error fetching feedback" + data);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function fetchAllCoupons(token: string) {
    try {
        const secret= await loadConfig();
        const response = await fetch(`${secret.BACKEND_URL}/api/admin/cos/fetchAllCouponsAdmin`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                token: token,
            },
            cache: "no-cache",
        });

        const data = await response.json(); // Parse the JSON response
        if (!response.ok) {
            throw new Error("Error fetching coupons" + data);
        }
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function updateCategory(
  token: string,
  originalCategory: string,
  newCategory: string,
  categories: string[]
) {
    console.log(categories)
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/cos/updateCategory`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        originalCategory: originalCategory,
        newCategory: newCategory,
        categories: categories,
      }),
      cache: "no-cache",
    });

    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      throw new Error("Error fetching feedback" + data);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function addCoupon(
  token: string,
  formData:{code: string;
    description: string;
    coupon_type: string;
    coupon_type_description: string;
    percentage_discount: number | string;
    discount_value: number | string;
    max_discount: number | string;
    min_order_value: number | string;
    start_date: string;
    end_date: string;
    usage_limit: number | null;
    user_usage_limit: number | null;
    free_items: {
      item_id: string;
      qty: number;
      name: string;
    }[];
    applicable_categories: string[];
    applicable_items: {
      item_id: string;
      qty: number;
      name: string;
    }[];
    selectedGuests: {
      booking_id: string;
      email: string;
    }[];
    is_active: boolean;}
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/cos/addCoupon`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        couponData:formData
      }),
      cache: "no-cache",
    });

    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      throw new Error("Error adding coupon" + data);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteCoupon(
  token: string,
  couponId:string
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/cos/deleteCoupon`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        couponId:couponId
      }),
      cache: "no-cache",
    });
    
    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      throw new Error("Error adding coupon" + data);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function modifyCoupon(
  token: string,
  formData:{code: string;
    description: string;
    coupon_type: string;
    coupon_type_description: string;
    percentage_discount: number | string;
    discount_value: number | string;
    max_discount: number | string;
    min_order_value: number | string;
    start_date: string;
    end_date: string;
    usage_limit: number | null;
    user_usage_limit: number | null;
    free_items: {
      item_id: string;
      qty: number;
      name: string;
    }[];
    applicable_categories: string[];
    applicable_items: {
      item_id: string;
      qty: number;
      name: string;
    }[];
    selectedGuests: {
      booking_id: string;
      email: string;
    }[];
    is_active: boolean;}
) {
  try {
    const secret = await loadConfig();
    const response = await fetch(`${secret.BACKEND_URL}/api/admin/cos/updateCoupon`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        couponData:formData
      }),
      cache: "no-cache",
    });

    const data = await response.json(); // Parse the JSON response
    if (!response.ok) {
      throw new Error("Error adding coupon" + data);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}