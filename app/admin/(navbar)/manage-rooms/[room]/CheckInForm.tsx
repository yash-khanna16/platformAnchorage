import React, { useEffect, useRef } from "react";
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image, Font, PDFDownloadLink } from "@react-pdf/renderer";

import logo from "./logo.png";
import veg from "@/app/assets/veg.png";
import nonVeg from "@/app/assets/nonveg.png";
import { Button, CircularProgress, IconButton } from "@mui/joy";
import { FileDownload } from "@mui/icons-material";
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import { domainToASCII } from "url";

// Create styles
type dummyType = {
  date: string;
  breakfast_veg: number;
  breakfast_nonveg: number;
  lunch_veg: number;
  lunch_nonveg: number;
  dinner_veg: number;
  dinner_nonveg: number;
};

const styles = StyleSheet.create({
  page: {
    // padding: 30,
    fontSize: 10,
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


const dummyData: dummyType[] = [];
const transportData: any[] = [];

const chunkArray = (array: any[], chunkSize: number) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const MyDocument = ({data}:{data:any}) => {
  const dataChunks = chunkArray(dummyData, 19);
  const transportChunks = chunkArray(transportData, 4);
  console.log("datachunks: ", dataChunks)
  console.log("transport chunks: ", transportChunks)

  const totalPages = Math.max(1, Math.max(dataChunks.length, transportChunks.length));
  console.log("data recieved: ", data)

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
                    <Text>Guest Name: {data.name}</Text>
                  </View>
                  <View style={styles.rowItemRight}>
                    <Text>Vessel: {data.vessel}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={{...styles.rowItemLeft, width: '30%'}}>
                    <Text>Phone No: {data.phone}</Text>
                  </View>
                  <View style={{...styles.rowItemRight, width: '80%'}}>
                    <Text>Email: {data.email}</Text>
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
                    <Text>Check In Date:-&nbsp;&nbsp; {data.checkin.split(" ")[0]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Time:- {data.checkin.split(" ")[1]} </Text>
                  </View>
                  <View style={styles.rowItemRight}>
                    <Text>Check Out Date:-&nbsp;&nbsp; {data.checkout.split(" ")[0]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Time:- {data.checkout.split(" ")[1]} </Text>
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
                                <Image src={veg.src} style={{ width: 10, height: 10, margin: "auto" }} />
                              </View>
                              <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                <Image src={nonVeg.src} style={{ width: 10, height: 10, margin: "auto" }} />
                              </View>
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                              <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                <Image src={veg.src} style={{ width: 10, height: 10, margin: "auto" }} />
                              </View>
                              <View style={{ width: "100%", padding: 5 }}>
                                <Image src={nonVeg.src} style={{ width: 10, height: 10, margin: "auto" }} />
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
                                  <Text>23-12-2024</Text>
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
                                        <Text style={{ margin: "auto" }}>{data.lunch_nonveg}</Text>
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
                            return (
                              <>
                                <View>
                                  <View style={{ display: "flex", flexDirection: "row", borderBottom: 1 }}>
                                    <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                      <Text>Pickup</Text>
                                    </View>
                                    <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                      <Text>{data.pickupDate}</Text>
                                    </View>
                                    <View style={{ width: "100%", padding: 5 }}>
                                      <Text>{data.pickupLocation}</Text>
                                    </View>
                                  </View>
                                  <View style={{ display: "flex", flexDirection: "row", borderBottom: 1 }}>
                                    <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                      <Text>Drop</Text>
                                    </View>
                                    <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                      <Text>{data.dropDate}</Text>
                                    </View>
                                    <View style={{ width: "100%", padding: 5 }}>
                                      <Text>{data.dropLocation}</Text>
                                    </View>
                                  </View>
                                  <View style={{ display: "flex", flexDirection: "row", borderBottom: 1 }}>
                                    <View style={{ width: "100%", padding: 5, borderRight: 1 }}>
                                      <Text>Car Number</Text>
                                    </View>
                                    <View style={{ width: "100%", padding: 5 }}>
                                      <Text>{data.carNumber}</Text>
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
                                  <View style={{ display: "flex", flexDirection: "row", borderBottom: 1 }}>
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
    </Document>
  );
};

const MyPdfViewer = ({ data }: { data: any }) => {
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    if (downloadLinkRef.current) {
      downloadLinkRef.current.click();
    }
  }, [downloadLinkRef]);
  const downloadPdf = async () => {
    const fileName = 'test.pdf';
    const blob = await pdf(<MyDocument data={data} />).toBlob();
    saveAs(blob, fileName);
  };

  return (
    <>
    {data && (
      <>
      {/* <PDFDownloadLink document={<MyDocument data={data} />} fileName="document.pdf">
        {({ loading, url }) =>
          !loading && (
            <IconButton>
              <FileDownload className=" scale-75" href={url || undefined}>
                Download PDF
              </FileDownload>
            </IconButton>
          )
        }
      </PDFDownloadLink> */}
       <button onClick={downloadPdf} ></button>
      {/* <PDFViewer width="100%" height={1000}>
        <MyDocument data={data} />
      </PDFViewer> */}

      </>
    )}
    </>
  );
};

export default MyPdfViewer;
