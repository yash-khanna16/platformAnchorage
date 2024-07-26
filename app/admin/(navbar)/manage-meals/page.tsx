"use client";
import { fetchMeals, fetchMealsByDate, searchAllGuests, updateMeals } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { Button, Chip, Input, Snackbar, Table } from "@mui/joy";
import React, { use, useEffect, useRef, useState } from "react";
import veg from "@/app/assets/veg.svg";
import nonveg from "@/app/assets/nonveg.svg";
import Image from "next/image";
import { Add, Check, CheckCircle, Close, KeyboardArrowLeft, KeyboardArrowRight, Remove, Warning } from "@mui/icons-material";
import { useDebounce } from "use-debounce";
import SearchInput from "@/app/components/Search";
import { searchIconSecondary } from "@/assets/icons";

// Define a type for meal counts
type ReservationType = {
  booking_id: string;
  room: string;
  name: string;
  breakfast_veg: number;
  breakfast_nonveg: number;
  lunch_veg: number;
  lunch_nonveg: number;
  dinner_veg: number;
  date: string;
  company: string;
  dinner_nonveg: number;
  checkin: string;
  checkout: string;
  status: string;
};

type MealsAPIType = {
  booking_id: string;
  date: string;
  breakfast_veg: number;
  breakfast_nonveg: number;
  lunch_veg: number;
  lunch_nonveg: number;
  dinner_veg: number;
  dinner_nonveg: number;
};

type MealType = "breakfast" | "lunch" | "dinner";

function Meals() {
  const [date, setDate] = useState(new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ReservationType[]>([]);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [values] = useDebounce(rows, 1000);
  const [alertType, setAlertType] = useState<"danger" | "neutral" | "success" | "warning">("neutral");
  const isFirstRender = useRef(true);
  const [search, setSearch] = useState("");
  const [allRows, setAllRows] = useState<ReservationType[]>([]);

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  function generatePredefinedData() {
    const predefinedNames = ["101", "102", "103", "104", "105", "106", "107"];

    // Create an array of objects with predefined names and empty values
    const data = predefinedNames.map((name) => ({
      status: "0/4",
      name: name,
      upcoming: "",
    }));

    // Add the special item at the end
    data.push({ name: "A-36 Studio 1", status: "0/4", upcoming: "" });

    return data;
  }

  const [dummy, setDummy] = useState(generatePredefinedData());

  useEffect(() => {
    if (values.length === 0 || isFirstRender.current) {
      console.log("here");
      // isFirstRender.current = false;
      return;
    }

    if (token) {
      setAlert(true);
      setMessage("Auto Saving Changes...");
      setAlertType("neutral");

      let body: MealsAPIType[] = [];
      values.map((value) => {
        body.push({
          booking_id: value.booking_id,
          date: value.date.split("T")[0],
          breakfast_veg: value.breakfast_veg,
          breakfast_nonveg: value.breakfast_nonveg,
          lunch_veg: value.lunch_veg,
          lunch_nonveg: value.lunch_nonveg,
          dinner_veg: value.dinner_veg,
          dinner_nonveg: value.dinner_nonveg,
        });
      });
      console.log("values ", body);

      updateMeals(token, body)
        .then((result) => {
          setAlertType("success");
          setMessage(result.message);
          setAlert(true);
        })
        .catch((error) => {
          setAlertType("danger");
          setMessage("Something went wrong.. Please try again!");
          setAlert(true);
        });
    }
  }, [values]);

  const handlePrevDate = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    isFirstRender.current = true;
    setDate(currentDate.toISOString().split("T")[0]);
  };

  const handleNextDate = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    isFirstRender.current = true;
    setDate(currentDate.toISOString().split("T")[0]);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  async function getGuests() {
    if (token) {
      try {
        setLoading(true);
        console.log("fetching for date: ", date);
        let fetchedRows = await fetchMealsByDate(token, date);
        const currentTime = new Date();
        console.log("fetched rows: ", fetchedRows);
        fetchedRows = fetchedRows.map((row: ReservationType) => {
          const checkinTime = new Date(row.checkin);
          const checkoutTime = new Date(row.checkout);

          let status;
          if (checkoutTime < currentTime) {
            status = "Expired";
          } else if (checkinTime > currentTime) {
            status = "Upcoming";
          } else {
            status = "Active";
          }

          return {
            ...row,
            checkin: formatDate(row.checkin),
            checkout: formatDate(row.checkout),
            status: status,
          };
        });
        console.log(fetchedRows);
        setRows(fetchedRows);
        setAllRows(fetchedRows);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
  }

  useEffect(() => {
    if (token) {
      getGuests();
    }
  }, [token, date]);

  const handleIncrement = (index: number, mealType: MealType, isVeg: boolean) => {
    isFirstRender.current = false;
    setRows((prevRows) => {
      const newRows = [...prevRows];
      if (isVeg) {
        newRows[index] = {
          ...newRows[index],
          [`${mealType}_veg`]: newRows[index][`${mealType}_veg`] + 1,
        };
      } else {
        newRows[index] = {
          ...newRows[index],
          [`${mealType}_nonveg`]: newRows[index][`${mealType}_nonveg`] + 1,
        };
      }
      return newRows;
    });

    setAllRows((prevAllRows) => {
      const newAllRows = prevAllRows.map((row) => {
        if (row.booking_id === rows[index].booking_id) {
          if (isVeg) {
            return {
              ...row,
              [`${mealType}_veg`]: row[`${mealType}_veg`] + 1,
            };
          } else {
            return {
              ...row,
              [`${mealType}_nonveg`]: row[`${mealType}_nonveg`] + 1,
            };
          }
        }
        return row;
      });
      return newAllRows;
    });
  };
  const handleMeals = (index: number, mealType: MealType, isVeg: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
    isFirstRender.current = false;
    setRows((prevRows) => {
      const newRows = [...prevRows];
      if (isVeg) {
        newRows[index] = {
          ...newRows[index],
          [`${mealType}_veg`]: e.target.value,
        };
      } else {
        newRows[index] = {
          ...newRows[index],
          [`${mealType}_nonveg`]: e.target.value,
        };
      }
      return newRows;
    });

    setAllRows((prevAllRows) => {
      const newAllRows = prevAllRows.map((row) => {
        if (row.booking_id === rows[index].booking_id) {
          if (isVeg) {
            return {
              ...row,
              [`${mealType}_veg`]: e.target.value,
            };
          } else {
            return {
              ...row,
              [`${mealType}_nonveg`]: e.target.value,
            };
          }
        }
        return row;
      });
      return newAllRows;
    });
  };

  const handleDecrement = (index: number, mealType: MealType, isVeg: boolean) => {
    isFirstRender.current = false;
    setRows((prevRows) => {
      const newRows = [...prevRows];
      if (isVeg) {
        newRows[index] = {
          ...newRows[index],
          [`${mealType}_veg`]: Math.max(newRows[index][`${mealType}_veg`] - 1, 0),
        };
      } else {
        newRows[index] = {
          ...newRows[index],
          [`${mealType}_nonveg`]: Math.max(newRows[index][`${mealType}_nonveg`] - 1, 0),
        };
      }
      return newRows;
    });

    setAllRows((prevAllRows) => {
      const newAllRows = prevAllRows.map((row) => {
        if (row.booking_id === rows[index].booking_id) {
          if (isVeg) {
            return {
              ...row,
              [`${mealType}_veg`]: Math.max(row[`${mealType}_veg`] - 1, 0),
            };
          } else {
            return {
              ...row,
              [`${mealType}_nonveg`]: Math.max(row[`${mealType}_nonveg`] - 1, 0),
            };
          }
        }
        return row;
      });
      return newAllRows;
    });
  };

  const columns = ["room", "name", "status"];

  const handleSearch = () => {
    console.log("searching...");
    isFirstRender.current = true;
    if (search.trim() === "") {
      setRows(allRows);
    } else {
      const lowercasedSearch = search.toLowerCase();
      const filtered = allRows.filter((row) =>
        columns.some((column) => row[column as keyof ReservationType]?.toString().toLowerCase().includes(lowercasedSearch))
      );
      setRows(filtered);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

  return (
    <div>
      <div className="my-10  mx-14 max-xl:mx-1 space-y-8">
        <div className="flex justify-between">
          <div className={`text-3xl font-semibold ${loading && "animate-pulse"}`}>Manage Meals</div>
          {/* {loading && <div className="w-52 h-10 animate-pulse bg-gray-200 rounded-md"></div>} */}
          {/* {!loading && ( */}
          <Input
            type="date"
            required
            value={date}
            size="lg"
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
          {/* )} */}
        </div>
        <div>
          <div className="flex justify-between my-5">
            {/* {!loading && ( */}
            <Button onClick={handlePrevDate} startDecorator={<KeyboardArrowLeft fontSize="small" />} size="sm">
              Prev&nbsp;&nbsp;
            </Button>
            {/* )} */}
            {/* {loading && <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-md"></div>} */}
            {/* {!loading && ( */}
            <Button onClick={handleNextDate} endDecorator={<KeyboardArrowRight fontSize="small" />} size="sm">
              &nbsp;&nbsp;Next
            </Button>
            {/* )} */}
            {/* {loading && <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-md"></div>} */}
          </div>
          <div className="my-5">
            {loading && <div className="w-full h-12 bg-gray-200 animate-pulse rounded-lg"></div>}
            {!loading && (
              <SearchInput
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                icon={searchIconSecondary}
                placeholder="Search by guest name, room number ..."
              />
            )}
          </div>
          {loading && (
            <div className="h-[100vh] w-[100%] animate-pulse rounded-md border  ">
              <div className="flex ">
                <div className="border-b border-r h-[60px] flex items-center px-5 max-lg:px-2 w-full">
                  <div className="w-full h-6 my-auto bg-gray-200  rounded-2xl"> </div>
                </div>
                <div className="border-b border-r h-[60px] flex items-center px-5 max-lg:px-2 w-2/5 max-lg:w-4/5">
                  <div className="w-full h-6 my-auto bg-gray-200  rounded-2xl"> </div>
                </div>
                <div className="border-b border-r h-[60px] flex items-center px-5 max-lg:px-2 w-full">
                  <div className="w-full h-6 my-auto bg-gray-200  rounded-2xl"> </div>
                </div>
                <div className="border-b border-r h-[60px] flex items-center px-5 max-lg:px-2 w-full">
                  <div className="w-full h-6 my-auto bg-gray-200  rounded-2xl"> </div>
                </div>
                <div className="border-b h-[60px] flex items-center px-5 max-lg:px-2 w-full">
                  <div className="w-full h-6 my-auto bg-gray-200  rounded-2xl"> </div>
                </div>
              </div>
              <div>
                {dummy.map((item, index) => (
                  <div className="flex ">
                    <div className="border-b border-r h-[105px] flex items-center px-5 max-lg:px-2 w-full">
                      <div className="w-full h-6 my-auto bg-gray-200  rounded-2xl"> </div>
                    </div>
                    <div className="border-b border-r h-[105px] flex items-center px-5 max-lg:px-2 w-2/5 max-lg:w-4/5">
                      <div className="w-full h-6 my-auto bg-gray-200  rounded-2xl"> </div>
                    </div>
                    <div className="border-b border-r h-[105px] flex items-center px-5 max-lg:px-2 w-full">
                      <div className="w-full h-6 my-auto bg-gray-200  rounded-2xl"> </div>
                    </div>
                    <div className="border-b border-r h-[105px] flex items-center px-5 max-lg:px-2 w-full">
                      <div className="w-full h-6 my-auto bg-gray-200  rounded-2xl"> </div>
                    </div>
                    <div className="border-b h-[105px] flex items-center px-5 max-lg:px-2 w-full">
                      <div className="w-full h-6 my-auto bg-gray-200  rounded-2xl"> </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!loading && (
            <>
              <div className="border border-1 max-lg:hidden">
                <Table borderAxis="bothBetween">
                  <thead className="">
                    <tr className="">
                      <th style={{ padding: "20px" }}>Room Number</th>
                      <th style={{ padding: "20px", width: "100px" }}>Status</th>
                      <th style={{ padding: "20px" }}>Breakfast</th>
                      <th style={{ padding: "20px" }}>Lunch</th>
                      <th style={{ padding: "20px" }}>Dinner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index}>
                        <th scope="row" className="">
                          <div className="px-4 flex flex-col my-3">
                            <div>
                              {row.room} {row.name}
                            </div>
                            <div className="text-slate-500">{row.company}</div>
                          </div>
                        </th>
                        <th scope="row" className="">
                          <div className="text-center">
                            <Chip
                              color={row.status === "Active" ? "success" : row.status === "Upcoming" ? "warning" : "danger"}
                              variant="outlined"
                            >
                              {row.status}
                            </Chip>
                          </div>
                        </th>
                        <td className="">
                          <div className="flex relative justify-center items-center space-y-3 space-x-4">
                            <Image alt="veg" className="absolute left-2" width={24} height={24} src={veg.src} />
                            <div className="flex">
                              <Button
                                color="neutral"
                                variant="plain"
                                size="sm"
                                onClick={() => handleDecrement(index, "breakfast", true)}
                              >
                                <Remove fontSize="small" />
                              </Button>
                              <Input className="w-12" value={row.breakfast_veg} readOnly />
                              <Button
                                color="neutral"
                                variant="plain"
                                size="sm"
                                onClick={() => handleIncrement(index, "breakfast", true)}
                              >
                                <Add fontSize="small" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex relative justify-center items-center space-y-3 space-x-4">
                            <Image alt="nonveg" className="absolute left-2 " width={24} height={24} src={nonveg.src} />
                            <div className="flex">
                              <Button
                                color="neutral"
                                variant="plain"
                                size="sm"
                                onClick={() => handleDecrement(index, "breakfast", false)}
                              >
                                <Remove fontSize="small" />
                              </Button>
                              <Input className="w-12" value={row.breakfast_nonveg} readOnly />
                              <Button
                                color="neutral"
                                variant="plain"
                                size="sm"
                                onClick={() => handleIncrement(index, "breakfast", false)}
                              >
                                <Add fontSize="small" />
                              </Button>
                            </div>
                          </div>
                        </td>
                        <td className="">
                          <div className="flex relative justify-center items-center space-y-3 space-x-4">
                            <Image alt="veg" className="absolute left-2" width={24} height={24} src={veg.src} />
                            <div className="flex">
                              <Button
                                color="neutral"
                                variant="plain"
                                size="sm"
                                onClick={() => handleDecrement(index, "lunch", true)}
                              >
                                <Remove fontSize="small" />
                              </Button>
                              <Input className="w-12" value={row.lunch_veg} readOnly />
                              <Button
                                color="neutral"
                                variant="plain"
                                size="sm"
                                onClick={() => handleIncrement(index, "lunch", true)}
                              >
                                <Add fontSize="small" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex relative justify-center items-center space-y-3 space-x-4">
                            <Image alt="nonveg" className="absolute left-2 " width={24} height={24} src={nonveg.src} />
                            <div className="flex">
                              <Button
                                color="neutral"
                                variant="plain"
                                size="sm"
                                onClick={() => handleDecrement(index, "lunch", false)}
                              >
                                <Remove fontSize="small" />
                              </Button>
                              <Input className="w-12" value={row.lunch_nonveg} readOnly />
                              <Button
                                color="neutral"
                                variant="plain"
                                size="sm"
                                onClick={() => handleIncrement(index, "lunch", false)}
                              >
                                <Add fontSize="small" />
                              </Button>
                            </div>
                          </div>
                        </td>
                        <td className="">
                          <div className="flex relative justify-center items-center space-y-3 space-x-4">
                            <Image alt="veg" className="absolute left-2" width={24} height={24} src={veg.src} />
                            <div className="flex">
                              <Button
                                color="neutral"
                                variant="plain"
                                size="sm"
                                onClick={() => handleDecrement(index, "dinner", true)}
                              >
                                <Remove fontSize="small" />
                              </Button>
                              <Input className="w-12" value={row.dinner_veg} readOnly />
                              <Button
                                color="neutral"
                                variant="plain"
                                size="sm"
                                onClick={() => handleIncrement(index, "dinner", true)}
                              >
                                <Add fontSize="small" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex relative justify-center items-center space-y-3 space-x-4">
                            <Image alt="nonveg" className="absolute left-2 " width={24} height={24} src={nonveg.src} />
                            <div className="flex">
                              <Button
                                color="neutral"
                                variant="plain"
                                size="sm"
                                onClick={() => handleDecrement(index, "dinner", false)}
                              >
                                <Remove fontSize="small" />
                              </Button>
                              <Input className="w-12" value={row.dinner_nonveg} readOnly />
                              <Button
                                color="neutral"
                                variant="plain"
                                size="sm"
                                onClick={() => handleIncrement(index, "dinner", false)}
                              >
                                <Add fontSize="small" />
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="border border-1 hidden max-lg:block">
                <Table borderAxis="bothBetween">
                  <thead className="">
                    <tr className="">
                      <th style={{ padding: "10px", width: "120px" }}>Room Number</th>
                      <th style={{ padding: "10px", width: "70px" }}>Status</th>
                      <th style={{ padding: "10px" }}>Breakfast</th>
                      <th style={{ padding: "10px" }}>Lunch</th>
                      <th style={{ padding: "10px" }}>Dinner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index}>
                        <th scope="row" style={{ padding: "0px" }}>
                          <div className="px-1 flex flex-col ">
                            <div>
                              {row.room} {row.name}
                            </div>
                            <div className="text-slate-500">
                              {row.company}
                            </div>
                          </div>
                        </th>
                        <th scope="row" style={{ padding: "0px" }}>
                          <div className="text-center">
                            <Chip
                              color={row.status === "Active" ? "success" : row.status === "Upcoming" ? "warning" : "danger"}
                              variant="outlined"
                            >
                              {row.status}
                            </Chip>
                          </div>
                        </th>
                        <td className="" style={{ padding: "0px" }}>
                          <div className="flex justify-around items-center my-2">
                            <Image alt="veg" width={20} height={20} src={veg.src} />
                            <Input
                              className="w-10"
                              value={row.breakfast_veg}
                              onChange={(e) => {
                                handleMeals(index, "breakfast", true, e);
                              }}
                            />
                          </div>
                          <div className="flex justify-around items-center  my-2">
                            <Image alt="nonveg" width={20} height={20} src={nonveg.src} />
                            <Input
                              className="w-10"
                              value={row.breakfast_nonveg}
                              onChange={(e) => {
                                handleMeals(index, "breakfast", false, e);
                              }}
                            />
                          </div>
                        </td>
                        <td className="" style={{ padding: "0px" }}>
                          <div className="flex justify-around items-center  my-2">
                            <Image alt="veg" width={20} height={20} src={veg.src} />
                            <Input
                              className="w-10"
                              value={row.lunch_veg}
                              onChange={(e) => {
                                handleMeals(index, "lunch", true, e);
                              }}
                            />
                          </div>
                          <div className="flex  justify-around items-center  my-2">
                            <Image alt="nonveg" width={20} height={20} src={nonveg.src} />
                            <Input
                              className="w-10"
                              value={row.lunch_nonveg}
                              onChange={(e) => {
                                handleMeals(index, "lunch", false, e);
                              }}
                            />
                          </div>
                        </td>
                        <td className="" style={{ padding: "0px" }}>
                          <div className="flex   justify-around items-center  my-2">
                            <Image alt="veg" width={20} height={20} src={veg.src} />
                            <Input
                              className="w-10"
                              value={row.dinner_veg}
                              onChange={(e) => {
                                handleMeals(index, "dinner", true, e);
                              }}
                            />
                          </div>
                          <div className="flex   justify-around items-center  my-2">
                            <Image alt="nonveg" width={20} height={20} src={nonveg.src} />
                            <Input
                              className="w-10"
                              value={row.dinner_nonveg}
                              onChange={(e) => {
                                handleMeals(index, "dinner", false, e);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
      <Snackbar
        open={alert}
        autoHideDuration={5000}
        color={alertType}
        onClose={() => {
          setAlert(false);
        }}
      >
        <div className="justify-between flex w-full">
          <div>
            {" "}
            {alertType === "success" ? <CheckCircle /> : <Warning />} &nbsp;&nbsp;{message}
          </div>
          <div onClick={() => setAlert(false)} className="cursor-pointer hover:bg-[#f3eded]">
            <Close />
          </div>
        </div>
      </Snackbar>
    </div>
  );
}

export default Meals;
