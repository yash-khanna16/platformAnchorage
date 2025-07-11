import React, { useEffect, useRef } from "react";
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image, Font, PDFDownloadLink } from "@react-pdf/renderer";

import logo from "./logo.png";
import veg from "@/app/assets/veg.png";
import nonVeg from "@/app/assets/nonveg.png";
import { Button, CircularProgress, IconButton } from "@mui/joy";
import { FileDownload } from "@mui/icons-material";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { domainToASCII } from "url";
import star from "@/app/assets/star-solid.png";
import { DATA_GRID_DEFAULT_SLOTS_COMPONENTS } from "@mui/x-data-grid/internals";

const dummyData: any[] = [];
const transportData: any[] = [];
Font.registerEmojiSource({
  format: "png",
  url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/",
  withVariationSelectors: true,
});
const chunkArray = (array: any[], chunkSize: number) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};
function formatDateToDDMMYYYYHHMM(dateString: string): string {
  const date = new Date(dateString);

  // Get day, month, year, hours, and minutes
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  // Format the date string as DD-MM-YYYY HH:MM
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

const styles = StyleSheet.create({
  page: {
    // padding: 30,
    fontSize: 10,
    fontFamily: "Times-Roman",
    // fontFamily:"Roboto",
    // fontWeight: 'bold',
    position: "relative",
  },
  anchorage_logo: {
    height: 180,
    width: 180,
  },
  wrapper: {
    padding: 30,
    paddingBottom: 40,
    textTransform: "uppercase",
    width: "100%",
    height: "100%",
    border: 1,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 220,
    borderBottom: 1,
  },
  headerContent: {
    padding: 10,
    fontSize: 8,
    width: 160,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  addressContent: {
    display: "flex",
    flexDirection: "column",
  },
  bottomSection: {
    height: "90%",
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  rowItemLeft: {
    borderRight: 1,
    borderBottom: 1,
    padding: 4,
    width: "100%",
  },
  rowItemRight: {
    borderBottom: 1,
    padding: 4,
    width: "100%",
  },
  mealListItem: {
    display: "flex",
    flexDirection: "row",
    columnGap: 5,
    padding: 5,
    alignItems: "center",
    borderRight: 1,
    borderBottom: 1,
    width: "25.9%",
  },
});

function convertDateFormat(dateString: string) {
  // Split the date string into year, month, and day
  const parts = dateString.split("-");
  // Rearrange the parts into DD-MM-YYYY format
  const newDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return newDate;
}

const MyDocument = ({ data }: { data: any }) => {
  const dataChunks = chunkArray(data.meals, 19);
  const transportChunks = chunkArray(data.movements, 4);

  const totalPages = Math.max(1, Math.max(dataChunks.length, transportChunks.length));
  // console.log("data recieved: ", data)

  return (
    <Document>
      {/* {totalPages} */}
      {[...Array(totalPages)].map((_, pageIndex) => (
        <Page size="A4" style={styles.page} key={pageIndex}>
          <View style={styles.wrapper}>
            <View style={{ border: 1 }}>
              <View style={styles.header}>
                <Image src={logo.src} style={styles.anchorage_logo} />
                <View style={styles.headerContent}>
                  <View style={styles.addressContent}>
                    <View>
                      <Text>A 21, BLOCK-1, SHANTI KUNJ VASANT KUNJ</Text>
                    </View>
                    <View>
                      <Text>NEW DELHI 110070</Text>
                    </View>
                    <View>
                      <Text>Mobile No: 828734046</Text>
                    </View>
                    <View>
                      <Text>Email:- abha@anchorage1.com</Text>
                    </View>
                  </View>
                  <View style={{ border: 1, padding: 5 }}>
                    <Text>Room No: {data.room} </Text>
                  </View>
                </View>
              </View>
              <View style={styles.bottomSection}>
                <View style={styles.row}>
                  <View style={styles.rowItemLeft}>
                    <Text>
                      Guest Name: {data.rank} {data.name}
                    </Text>
                  </View>
                  <View style={styles.rowItemRight}>
                    <Text>Vessel: {data.vessel}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={{ ...styles.rowItemLeft, width: "30%" }}>
                    <Text>Phone No: {data.phone}</Text>
                  </View>
                  <View style={{ ...styles.rowItemRight, width: "80%" }}>
                    <Text>Email: {data.guest_email}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.rowItemLeft}>
                    <Text>Company Name: {data.company}</Text>
                  </View>
                  <View style={styles.rowItemRight}>
                    <Text>ID No: {data.id}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.rowItemLeft}>
                    <Text>Remarks: {data.remarks}</Text>
                  </View>
                  <View style={styles.rowItemRight}>
                    <Text>Add. Info: {data.additional_info}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={{ ...styles.rowItemLeft, borderRight: 0 }}>
                    <Text> </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.rowItemLeft}>
                    <Text>
                      Check In Date:-&nbsp;&nbsp; {data.checkin.split(" ")[0]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Time:-{" "}
                      {data.checkin.split(" ")[1]}{" "}
                    </Text>
                  </View>
                  <View style={styles.rowItemRight}>
                    <Text>
                      Check Out Date:-&nbsp;&nbsp; {data.checkout.split(" ")[0]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Time:-{" "}
                      {data.checkout.split(" ")[1]}{" "}
                    </Text>
                  </View>
                </View>
                <View style={{ display: "flex", flexDirection: "row", height: "100%" }}>
                  <View style={{ height: "100%", borderRight: 1, flex: "0 0 40%" }}>
                    <View style={{ display: "flex", flexDirection: "column" }}>
                      <View style={{ width: "100%", borderRight: "0px solid black", display: "flex", flexDirection: "row" }}>
                        <View
                          style={{
                            width: "30%",
                            borderRight: 1,
                            borderBottom: 1,
                            height: 65,
                            padding: 5,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text>Date</Text>
                        </View>
                        <View style={{ display: "flex", flexDirection: "column", width: "70%" }}>
                          <View
                            style={{
                              borderBottom: 1,
                              padding: 5,
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                            }}
                          >
                            <View>
                              <Text>Meals</Text>
                            </View>
                          </View>
                          <View style={{ display: "flex", flexDirection: "row", borderBottom: 1 }}>
                            {/* <View style={{ borderRight: 1, width: "100%", padding: 5 }}>
                              <Text>Breakfast</Text>
                            </View> */}
                            <View style={{ borderRight: 1, width: "100%", padding: 5 }}>
                              <Text>Lunch</Text>
                            </View>
                            <View style={{ padding: 5, width: "100%" }}>
                              <Text>Dinner</Text>
                            </View>
                          </View>
                          <View style={{ display: "flex", flexDirection: "row", borderBottom: 1, width: "100%" }}>
                            <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                              <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                {/* <Image src={veg.src} style={{ width: 10, height: 10, margin: "auto" }} /> */}
                                <Text>Veg</Text>
                              </View>
                              <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                <Text>N.Veg</Text>
                                {/* <Image src={nonVeg.src} style={{ width: 10, height: 10, margin: "auto" }} /> */}
                              </View>
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                              <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                <Text>Veg</Text>
                                {/* <Image src={veg.src} style={{ width: 10, height: 10, margin: "auto" }} /> */}
                              </View>
                              <View style={{ width: "100%", padding: 5 }}>
                                <Text>N.Veg</Text>
                                {/* <Image src={nonVeg.src} style={{ width: 10, height: 10, margin: "auto" }} /> */}
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                      {/* Meals */}
                      {pageIndex < dataChunks.length && (
                        <>
                          {dataChunks[pageIndex].map((data, index) => (
                            <>
                              <View
                                style={{ width: "100%", borderRight: "0px solid black", display: "flex", flexDirection: "row" }}
                              >
                                <View
                                  style={{
                                    width: "30%",
                                    borderRight: 1,
                                    borderBottom: 1,
                                    paddingVertical: 5,
                                    paddingHorizontal: 3,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text>{convertDateFormat(data.date.split("T")[0])}</Text>
                                </View>
                                <View style={{ display: "flex", flexDirection: "column", width: "70%" }}>
                                  <View style={{ display: "flex", flexDirection: "row", borderBottom: 1, width: "100%" }}>
                                    {/* <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                                  <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                    <Text style={{ margin: "auto" }}> {data.breakfast_veg} </Text>
                                  </View>
                                  <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                    <Text style={{ margin: "auto" }}> {data.breakfast_nonveg} </Text>
                                  </View>
                                </View> */}
                                    <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                                      <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                        <Text style={{ margin: "auto" }}>{data.lunch_veg}</Text>
                                      </View>
                                      <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                        <Text style={{ margin: "auto" }}>{data.lunch_nonveg}</Text>
                                      </View>
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                                      <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                        <Text style={{ margin: "auto" }}>{data.dinner_veg}</Text>
                                      </View>
                                      <View style={{ width: "100%", padding: 5 }}>
                                        <Text style={{ margin: "auto" }}>{data.dinner_nonveg}</Text>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </>
                          ))}
                        </>
                      )}
                    </View>
                  </View>
                  <View style={{ flex: "0 0 60%", display: "flex", flexDirection: "column" }}>
                    <View style={{ width: "100%", textAlign: "center", borderBottom: 1, padding: 5 }}>
                      <Text>Transportation</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "column" }}>
                      <View style={{ display: "flex", flexDirection: "row", borderBottom: 1 }}>
                        <View style={{ width: "100%", padding: 5, fontStyle: "bold", borderRight: 1 }}>
                          {/* <Text>Type</Text> */}
                        </View>
                        <View style={{ width: "100%", padding: 5, fontStyle: "bold", borderRight: 1 }}>
                          <Text>Date</Text>
                        </View>
                        <View style={{ width: "100%", padding: 5, fontStyle: "bold" }}>
                          <Text>Location</Text>
                        </View>
                      </View>
                      {pageIndex < transportChunks.length && (
                        <>
                          {transportChunks[pageIndex].map((data) => {
                            const pickup_time = data.pickup_time.split("T")[1];
                            const return_time = data.return_time.split("T")[1];
                            return (
                              <>
                                <View>
                                  <View style={{ display: "flex", flexDirection: "row", borderBottom: 1 }}>
                                    <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                      <Text>Pickup</Text>
                                    </View>
                                    <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                      <Text>
                                        {convertDateFormat(data.pickup_time.split("T")[0]) +
                                          " " +
                                          pickup_time.split(":")[0] +
                                          ":" +
                                          pickup_time.split(":")[1]}
                                      </Text>
                                    </View>
                                    <View style={{ width: "100%", padding: 5 }}>
                                      <Text>{data.pickup_location}</Text>
                                    </View>
                                  </View>
                                  <View style={{ display: "flex", flexDirection: "row", borderBottom: 1 }}>
                                    <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                      <Text>Drop</Text>
                                    </View>
                                    <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                      <Text>
                                        {convertDateFormat(data.return_time.split("T")[0]) +
                                          " " +
                                          return_time.split(":")[0] +
                                          ":" +
                                          return_time.split(":")[1]}
                                      </Text>
                                    </View>
                                    <View style={{ width: "100%", padding: 5 }}>
                                      <Text>{data.drop_location}</Text>
                                    </View>
                                  </View>
                                  <View style={{ display: "flex", flexDirection: "row", borderBottom: 1 }}>
                                    <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                      <Text>Car Number</Text>
                                    </View>
                                    <View style={{ width: "100%", padding: 5 }}>
                                      <Text>{data.car_number}</Text>
                                    </View>
                                    <View style={{ width: "100%", padding: 5 }}></View>
                                  </View>
                                  <View style={{ display: "flex", flexDirection: "row", borderBottom: 1 }}>
                                    <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                      <Text>Add. Info</Text>
                                    </View>
                                    <View style={{ width: "100%", padding: 5 }}></View>
                                    <View style={{ width: "100%", padding: 5 }}></View>
                                  </View>
                                  <View style={{ display: "flex", flexDirection: "row", borderBottom: 1, alignItems: "center" }}>
                                    <View style={{ width: "100%", padding: 5 }}>
                                      <Text>
                                        ------------------------------------------------------------------------------------------------
                                      </Text>
                                    </View>
                                    <View style={{ width: "100%", padding: 5 }}></View>
                                    <View style={{ width: "100%", padding: 5 }}></View>
                                  </View>
                                </View>
                              </>
                            );
                          })}
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{ position: "absolute", bottom: 18, right: 265 }}>
            <Text>
              Page {pageIndex + 1} of {totalPages}{" "}
            </Text>
          </View>
        </Page>
      ))}
      <Page size="A4" style={styles.page}>
        <View style={{ padding: 30, paddingBottom: 40, width: "100%", height: "100%", border: 1 }}>
          <View style={{ border: 1, padding: 20, height: "100%" }}>
            <Text style={{ fontSize: 20 }}>OCCUPANCY TIMELINE</Text>
            {/* HEADER */}
            <View style={{ display: "flex", flexDirection: "row", marginTop: 10, width: "100%" }}>
              <View
                style={{ border: 1, borderRight: 0, padding: 5, width: "17%", alignItems: "center", justifyContent: "center" }}
              >
                <Text>TYPE</Text>
              </View>
              <View
                style={{ border: 1, borderRight: 0, padding: 5, width: "17%", alignItems: "center", justifyContent: "center" }}
              >
                <Text>START TIME</Text>
              </View>
              <View
                style={{ border: 1, borderRight: 0, padding: 5, width: "17%", alignItems: "center", justifyContent: "center" }}
              >
                <Text>END TIME</Text>
              </View>
              <View style={{ border: 1, textAlign: "center", width: "49%" }}>
                <View style={{ padding: 5 }}>
                  <Text>GUEST INFORMATION</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", width: 239 }}>
                  <View style={{ padding: 5, borderTop: 1, borderRight: 1, width: "100%" }}>
                    <Text>NAME</Text>
                  </View>
                  <View style={{ padding: 5, borderTop: 1, borderRight: 1, width: "100%" }}>
                    <Text>RANK</Text>
                  </View>
                  <View style={{ padding: 5, borderTop: 1, width: "100%" }}>
                    <Text>COMPANY</Text>
                  </View>
                </View>
              </View>
            </View>

            {data.occupancy.map((occupancy: any, index: number) => (
              <View key={index} style={{ display: "flex", flexDirection: "row" }}>
                <View
                  style={{
                    padding: 5,
                    width: "17%",
                    alignItems: "center",
                    borderBottom: 1,
                    borderLeft: 1,
                    justifyContent: "center",
                  }}
                >
                  <Text>{occupancy.occupancy}</Text>
                </View>
                <View
                  style={{
                    padding: 5,
                    width: "17%",
                    alignItems: "center",
                    borderBottom: 1,
                    borderLeft: 1,
                    justifyContent: "center",
                  }}
                >
                  <Text>{formatDateToDDMMYYYYHHMM(occupancy.start)}</Text>
                </View>
                <View
                  style={{
                    padding: 5,
                    width: "17%",
                    borderBottom: 1,
                    borderLeft: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text>{formatDateToDDMMYYYYHHMM(occupancy.end)}</Text>
                </View>
                <View style={{ width: "49%" }}>
                  {occupancy.bookings.map((booking: any, index: number) => (
                    <View key={index} style={{ display: "flex", flexDirection: "row", width: 240.7 }}>
                      <View style={{ padding: 5, borderBottom: 1, borderRight: 1, width: 242, borderLeft: 1, minHeight: 40 }}>
                        <Text>{booking.name}</Text>
                      </View>
                      <View style={{ padding: 5, borderBottom: 1, borderRight: 1, width: 239, minHeight: 40 }}>
                        <Text>{booking.rank}</Text>
                      </View>
                      <View style={{ padding: 5, borderBottom: 1, borderRight: 1, width: "100%", minHeight: 40 }}>
                        <Text>{booking.company}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={{ padding: 30, paddingBottom: 40, width: "100%", height: "100%", border: 1 }}>
          <View style={{ border: 1, padding: 20, height: "100%" }}>
            <Text style={{ fontSize: 20 }}>FEEDBACK FORM</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 20,
                border: 1,
                borderBottom: 0,
                height: "13%",
              }}
            >
              <View style={styles.row}>
                <View style={styles.rowItemLeft}>
                  <Text>
                    Guest Name: {data.rank} {data.name}
                  </Text>
                </View>
                <View style={styles.rowItemRight}>
                  <Text>Vessel: {data.vessel}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={{ ...styles.rowItemLeft, width: "30%" }}>
                  <Text>Phone No: {data.phone}</Text>
                </View>
                <View style={{ ...styles.rowItemRight, width: "80%" }}>
                  <Text>Email: {data.guest_email}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.rowItemLeft}>
                  <Text>Company Name: {data.company}</Text>
                </View>
                <View style={styles.rowItemRight}>
                  <Text>ID No: {data.id}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.rowItemLeft}>
                  <Text>
                    Check In Date:-&nbsp;&nbsp; {data.checkin.split(" ")[0]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Time:-{" "}
                    {data.checkin.split(" ")[1]}{" "}
                  </Text>
                </View>
                <View style={styles.rowItemRight}>
                  <Text>
                    Check Out Date:-&nbsp;&nbsp; {data.checkout.split(" ")[0]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Time:-{" "}
                    {data.checkout.split(" ")[1]}{" "}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ marginVertical: 20, fontSize: 12 }}>
              <Text>KINDLY WRITE A FEW WORDS ON OUR SERVICES:</Text>
            </View>
            <View style={{ marginVertical: 15, fontSize: 12, display: "flex", flexDirection: "column", rowGap: 20 }}>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 250 }}>
                  <Text></Text>
                </View>
                <View style={{ marginHorizontal: 20, display: "flex", flexDirection: "row", columnGap: 40 }}>
                  <Text>1</Text>
                  <Text>2</Text>
                  <Text>3</Text>
                  <Text>4</Text>
                  <Text>5</Text>
                  {/* <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} /> */}
                </View>
              </View>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 250 }}>
                  <Text>QUALITY OF FOOD</Text>
                </View>
                <View style={{ marginHorizontal: 20, display: "flex", flexDirection: "row", columnGap: 32 }}>
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                </View>
              </View>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 250 }}>
                  <Text>CLEAN AND TIDY ROOM</Text>
                </View>
                <View style={{ marginHorizontal: 20, display: "flex", flexDirection: "row", columnGap: 32 }}>
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                </View>
              </View>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 250 }}>
                  <Text>STAFFS ARE WILLING TO HELP</Text>
                </View>
                <View style={{ marginHorizontal: 20, display: "flex", flexDirection: "row", columnGap: 32 }}>
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                </View>
              </View>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 250 }}>
                  <Text>STAFF CAN BE TRUSTED</Text>
                </View>
                <View style={{ marginHorizontal: 20, display: "flex", flexDirection: "row", columnGap: 32 }}>
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                </View>
              </View>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 250 }}>
                  <Text>GENERAL QUALITY OF OUR GUEST HOUSE</Text>
                </View>
                <View style={{ marginHorizontal: 20, display: "flex", flexDirection: "row", columnGap: 32 }}>
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                  <Image src={star.src} style={{ height: 14, width: 14 }} />
                </View>
              </View>
            </View>
            {data.document_url && /\.(jpg|jpeg|png)$/i.test(data.document_url) && (
              <View style={{ marginTop: 15, width: "100%" }}>
                <Text style={{ fontSize: 12, marginVertical: 8 }}>ID DOCUMENT</Text>
                <View style={{ display: "flex", flexDirection: "row", columnGap: 15, justifyContent: "center" }}>
                  <Image
                    style={{ height: 200, marginVertical: 20, objectFit: "contain" }}
                    src={data.document_url}
                  />
                  {data.document_url_back && /\.(jpg|jpeg|png)$/i.test(data.document_url_back) && (
                    <Image
                      style={{ height: 200, marginVertical: 20, objectFit: "contain" }}
                      src={data.document_url_back}
                    />
                  )}
                </View>
              </View>
            )}

            <View style={{ fontSize: 12, marginTop: "auto", padding: 20, marginLeft: "auto" }}>
              <Text>SIGNATURE </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
