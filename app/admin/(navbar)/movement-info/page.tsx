"use client";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CircularProgress,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  ModalDialog,
  Snackbar,
  Stack,
  Typography,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Car from "./Car";
import Driver from "./Driver";
import { Add, Close, Info } from "@mui/icons-material";
import { addCar, addDriver, fetchAllCars, fetchAllDrivers } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { Modal } from "@mui/joy";

type CarType = {
  name: string;
  number: string;
};
type DriverType = {
  name: string;
  phone: string;
  status: number;
};

function Movement() {
  const [token, setToken] = useState<string | null>(null);
  const [cars, setCars] = useState<CarType[]>([]);
  const [drivers, setDrivers] = useState<DriverType[]>([]);
  const [addCarModal, setAddCarModal] = useState<boolean>(false);
  const [addDriverModal, setAddDriverModal] = useState<boolean>(false);
  const [newCar, setNewCar] = useState("");
  const [newCarNumber, setNewCarNumber] = useState("");
  const [newDriver, setNewDriver] = useState("");
  const [newDriverNumber, setNewDriverNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(false);

  function generatePredefinedData() {
    const predefinedNames = [
      "101",
      "102",
      "103",
      "104",
      "105",
      "106",
      "107",
      "108",
      "109",
      "110",
      "111",
      "112",
      "114",
      "301",
      "302",
      "303",
      "304",
      "305",
      "306",
      "401",
      "402",
      "403",
      "404",
      "501",
      "502",
      "503",
      "504",
      "601",
      "602",
      "603",
      "604",
      "701",
      "702",
      "703",
      "704",
    ];
    const data = predefinedNames.map((name) => ({
      status: "0/4",
      name: name,
      upcoming: "",
    }));
    data.push({ name: "A-36 Studio 1", status: "0/4", upcoming: "" });
    return data;
  }

  // Generate the data
  const dummyData = generatePredefinedData();
  // const [carLoading, setCarLoading] = useState(false)
  // const [driverLoading, setDriverLoading] = useState(false)

  async function handleAddCar() {
    if (token) {
      try {
        setLoading(true);
        await addCar(token, newCar, newCarNumber);
        const fetchedCars = await fetchAllCars(token);
        setCars(fetchedCars);
        setLoading(false);
        setAddCarModal(false);
        setNewCar("");
        setNewCarNumber("");
        setAlert(true);
        setMessage("Car added successfully!");
      } catch (error) {
        setAddCarModal(false);
        setLoading(false);
        setAlert(true);
        setMessage("Error adding car!");
        console.log("Error adding car!");
      }
    }
  }
  async function handleAddDriver() {
    if (token) {
      try {
        setLoading(true);
        await addDriver(token, newDriver, newDriverNumber);
        const fetchedDrivers = await fetchAllDrivers(token);
        setDrivers(fetchedDrivers);
        setLoading(false);
        setNewDriver("");
        setAlert(true);
        setMessage("Driver added successfully!");
        setNewDriverNumber("");
        setAddDriverModal(false);
      } catch (error) {
        setAddDriverModal(false);
        setAlert(true);
        setMessage("Error Adding Driver!");
        console.log("Error adding driver!");
      }
    }
  }

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchAllCars(token)
        .then((cars) => {
          // console.log("cars: ", cars);
          setLoading(false);
          setCars(cars);
        })
        .catch((error) => {
          setLoading(false);
          console.log("Error fetching cars", error);
        });
      fetchAllDrivers(token)
        .then((drivers) => {
          setLoading(false);
          // console.log("Drivers: ", drivers);
          setDrivers(drivers);
        })
        .catch((error) => {
          setLoading(false);
          console.log("Error fetching drivers", error);
        });
    }
  }, [reload]);

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchAllCars(token)
        .then((cars) => {
          // console.log("cars: ", cars);
          setLoading(false);
          setCars(cars);
        })
        .catch((error) => {
          setLoading(false);
          console.log("Error fetching cars", error);
        });
      fetchAllDrivers(token)
        .then((drivers) => {
          setLoading(false);
          // console.log("Drivers: ", drivers);
          setDrivers(drivers);
        })
        .catch((error) => {
          setLoading(false);
          console.log("Error fetching drivers", error);
        });
    }
  }, [token]);
  return (
    <div className="flex py-5 px-5 h-screen overflow-hidden">
      <div className="w-[30%] p-2 overflow-auto h-screen max-lg:w-[40%]">
        <div className="text-3xl max-lg:text-2xl font-semibold text-center flex justify-between max-md:flex-col max-md:gap-y-4">
          <div className={`${loading && "animate-pulse"}`}>Drivers</div>
          {loading && <div className="h-9 animate-pulse bg-gray-200 w-32 rounded-md"></div>}
          {!loading && (
            <Button
              color="neutral"
              onClick={() => {
                setAddDriverModal(true);
              }}
              variant="outlined"
              startDecorator={<Add />}
            >
              Add Driver
            </Button>
          )}
        </div>
        {loading && (
          <div className="flex flex-wrap animate-pulse justify-around gap-x-10 my-10 gap-y-10 max">
            {dummyData.map((element, index) => (
              <div className="flex flex-col items-center justify-center space-y-3" key={index}>
                <div className="w-[90px] h-[90px] rounded-full bg-gray-200"></div>
                <div className="w-16 h-5 bg-gray-200 rounded-2xl"></div>
              </div>
            ))}
          </div>
        )}
        {!loading && (
          <div className="flex flex-wrap justify-around gap-x-5 my-10 gap-y-10 max">
            {drivers.map((driver, index) => (
              <Driver
                reload={reload}
                setReload={setReload}
                key={index}
                status={driver.status === 1 ? "green" : "red"}
                name={driver.name}
              />
            ))}
          </div>
        )}
      </div>
      <div className="w-[70%] py-5 px-12 max-lg:p-2 overflow-auto h-screen border-l max-lg:w-[60%]">
        <div className="text-3xl max-lg:text-2xl font-semibold text-center flex justify-between max-md:flex-col max-md:gap-y-4">
          <div className={`${loading && "animate-pulse"}`}>Cars</div>
          <div>
            {loading && <div className="h-9 animate-pulse bg-gray-200 w-32 rounded-md"></div>}
            {!loading && (
              <Button
                color="neutral"
                variant="outlined"
                onClick={() => {
                  setAddCarModal(true);
                }}
                startDecorator={<Add />}
              >
                Add Car
              </Button>
            )}
          </div>
        </div>
        {loading && (
          <div className="flex gap-x-8 gap-y-5 animate-pulse flex-wrap my-10">
            {dummyData.map((element, index) => (
              <div className="h-40 w-[300px] flex border rounded-2xl ">
                <div className="w-1/2">
                  <div className="w-28 h-6 mt-10 mx-5 bg-gray-200 rounded-2xl"></div>
                  <div className="w-16 h-6 mt-10 mx-5 bg-gray-200 rounded-2xl"></div>
                </div>
                <div className="w-24 h-20 my-auto mx-5 rounded-md bg-gray-200"></div>
              </div>
            ))}
          </div>
        )}
        {!loading && (
          <div className="flex gap-x-8 gap-y-5 flex-wrap my-10">
            {cars.map((car, index) => (
              <Car
                key={index}
                reload={reload}
                setReload={setReload}
                name={`${car.name}`}
                number={car.number}
                distance=""
                time=""
              />
            ))}
          </div>
        )}
      </div>
      <Modal open={addCarModal} onClose={() => setAddCarModal(false)}>
        <ModalDialog>
          <DialogTitle>Add New Car</DialogTitle>
          <DialogContent>Enter details of the new car. </DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleAddCar();
              setAddCarModal(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <div className="space-y-2">
                  {/* <FormLabel>Add Car</FormLabel> */}
                  <Input
                    value={newCar}
                    onChange={(e) => {
                      setNewCar(e.target.value);
                    }}
                    placeholder="Name"
                    autoFocus
                    required
                  />
                  <Input
                    value={newCarNumber}
                    placeholder="Number"
                    onChange={(e) => {
                      setNewCarNumber(e.target.value);
                    }}
                    autoFocus
                    required
                  />
                </div>
              </FormControl>
              <Button loading={loading} type="submit">
                Submit
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
      <Modal open={addDriverModal} onClose={() => setAddDriverModal(false)}>
        <ModalDialog>
          <DialogTitle>Add New Driver</DialogTitle>
          <DialogContent>Enter details of the new driver. </DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleAddDriver();
              // if (newDriver) {
              //   setAddDriverModal(false);
              // }
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <div className="space-y-2">
                  {/* <FormLabel>Add Car</FormLabel> */}
                  <Input
                    value={newDriver}
                    onChange={(e) => {
                      setNewDriver(e.target.value);
                    }}
                    placeholder="Name"
                    required
                  />
                  <Input
                    value={newDriverNumber}
                    placeholder="Phone"
                    onChange={(e) => {
                      setNewDriverNumber(e.target.value);
                    }}
                  />
                </div>
              </FormControl>
              <Button loading={loading} type="submit">
                Submit
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
      <Snackbar
        open={alert}
        autoHideDuration={5000}
        onClose={() => {
          setAlert(false);
        }}
      >
        <Info /> {message}{" "}
        <span onClick={() => setAlert(false)} className="cursor-pointer hover:bg-[#f3eded]">
          <Close />
        </span>{" "}
      </Snackbar>
    </div>
  );
}

export default Movement;
