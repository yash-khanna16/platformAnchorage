import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import logo from "@/app/assets/anchorage_logo1.png";
import HelveticaRegular from "@/assets/fonts/Helvetica.ttf";
import HelveticaBold from "@/assets/fonts/Helvetica-Bold.ttf";
import HelveticaOblique from "@/assets/fonts/Helvetica-Oblique.ttf";
import rupee from "./rupee.png";

// Register the Helvetica font with different styles
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: HelveticaRegular, // Regular
      fontWeight: "normal",
    },
    {
      src: HelveticaBold,
      fontWeight: "bold", // Bold
    },
    {
      src: HelveticaOblique,
      fontStyle: "italic", // Italic
    },
  ],
});

Font.register({
  family: "Helvetica Bold",
  fonts: [{ src: HelveticaBold }],
});

// Define styles
const styles = StyleSheet.create({
  page: {
    // padding: 30,
    fontFamily: "Helvetica",
    position: "relative",
  },
  section: {
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
  },
  table: {
    marginBottom: 10,
    border: 1,
    borderColor: "#a1a1a1",
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 15,
    justifyContent: "flex-start",
    textAlign: "left",
    fontFamily: "Helvetica Bold",
  },
  heading: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0,
    borderBottomColor: "#a1a1a1",
    borderBottomStyle: "solid",
    fontSize: 10,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f5f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#a1a1a1",
    borderBottomStyle: "solid",
    fontSize: 10,
  },
  col: {
    width: "25%",
    paddingVertical: 5,
    borderRightWidth: 1,
    borderRightColor: "#a1a1a1",
    paddingHorizontal: 5,
    textAlign: "center",
  },
  text: {
    fontSize: 10,
  },
  boldText: {
    fontFamily: "Helvetica Bold",
    fontSize: 10,
  },
  content: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#a1a1a1",
  },
});

type Item = {
  name: string;
  qty: number;
  price: number;
};

export type OrderDataType = {
  order_id: number;
  booking_id: string;
  room: string;
  created_at: string;
  status: string;
  remarks: string;
  items: Item[];
  name: string;
  email: string;
  phone: string;
  discount: number;
};

const platformFee = 2;

const OrderFormDocument = ({ orderData }: { orderData: OrderDataType[] }) => {
  console.log("order: ", orderData)
  return (
    <Document>
      {orderData.map((order, orderIndex) => {
        const { order_id, room, created_at, remarks, items, name, email } = order;

        const totalAmount = items.reduce((total, item) => total + item.price * item.qty, 0);

        return (
          <Page key={orderIndex} style={styles.page}>
            <View style={{ height: "100%", padding: 20 }}>
              <View style={{ border: "1px solid black", padding: 20, margin: 10, height: "100%" }}>
                <View style={styles.heading}>
                  <Image src={logo.src} style={{ width: 80, height: 80 }} />
                </View>
                <View style={styles.heading}>
                  <Text style={styles.header}>Order Summary</Text>
                </View>

                <View style={styles.content}>
                  <View style={styles.section}>
                    <Text style={styles.boldText}>Order ID:</Text>
                    <Text style={styles.text}>{order_id}</Text>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.boldText}>Room:</Text>
                    <Text style={styles.text}>{room}</Text>
                  </View>
                </View>

                <View style={styles.content}>
                  <View style={styles.section}>
                    <Text style={styles.boldText}>Name:</Text>
                    <Text style={styles.text}>{name}</Text>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.boldText}>Email:</Text>
                    <Text style={styles.text}>{email}</Text>
                  </View>
                </View>

                <View style={styles.content}>
                  <View style={styles.section}>
                    <Text style={styles.boldText}>Remarks:</Text>
                    <Text style={styles.text}>{remarks}</Text>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.boldText}>Date:</Text>
                    <Text style={styles.text}>{new Date(Number(created_at)).toDateString()}</Text>
                  </View>
                </View>

                <View style={[styles.table, { marginTop: 15 }]}>
                  <View style={styles.headerRow}>
                    <Text style={[styles.col, styles.boldText, { width: "7%" }]}>S.No</Text>
                    <Text style={[styles.col, styles.boldText, { textAlign: "left" }]}>Item</Text>
                    <Text style={[styles.col, styles.boldText]}>Price</Text>
                    <Text style={[styles.col, styles.boldText]}>Qty</Text>
                    <Text style={[styles.col, styles.boldText, { borderRightWidth: 0, textAlign: "right", paddingRight: 45 }]}>
                      Total
                    </Text>
                  </View>
                  {items.map((item, index) => (
                    <View key={index} style={styles.row}>
                      <Text style={[styles.col, { width: "7%" }]}>{index + 1}</Text>
                      <Text style={{ ...styles.col, textAlign: "left" }}>{item.name}</Text>
                      <Text style={styles.col}>
                        <Image src={rupee.src} style={{ width: 7, height: 7 }} /> {item.price}
                      </Text>
                      <Text style={styles.col}>{item.qty}</Text>
                      <Text style={[styles.col, { borderRightWidth: 0, textAlign: "right", paddingRight: 45 }]}>
                        <Image src={rupee.src} style={{ width: 7, height: 7 }} /> {item.price * item.qty}
                      </Text>
                    </View>
                  ))}
                  <View
                    style={{
                      fontSize: 10,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderTop: 1,
                      borderColor: "#a1a1a1",
                      borderRightWidth: 0,
                      borderBottomWidth: 0,
                    }}
                  >
                    <Text style={[styles.col, { borderRight: 0, textAlign: "left" }]}>SubTotal</Text>
                    <Text style={[styles.col, { borderRight: 0, textAlign: "right", paddingRight: 45 }]}>
                      <Image src={rupee.src} style={{ width: 7, height: 7 }} /> {totalAmount}
                    </Text>
                  </View>
                  {order.discount > 0 && (
                    <View
                      style={{
                        fontSize: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderTop: 0,
                        borderColor: "#a1a1a1",
                        borderRightWidth: 0,
                        borderBottomWidth: 0,
                      }}
                    >
                      <Text style={[styles.col, { borderRight: 0, textAlign: "left" }]}>Discount</Text>
                      <Text style={[styles.col, { borderRight: 0, textAlign: "right", paddingRight: 45 }]}>
                        <Image src={rupee.src} style={{ width: 7, height: 7 }} /> {order.discount}
                      </Text>
                    </View>
                  )}
                  <View
                    style={{
                      fontSize: 10,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderTop: 0,
                      borderColor: "#a1a1a1",
                      borderRightWidth: 0,
                      borderBottomWidth: 0,
                    }}
                  >
                    <Text style={[styles.col, { borderRight: 0, textAlign: "left" }]}>Platform Fee</Text>
                    <Text style={[styles.col, { borderRight: 0, textAlign: "right", paddingRight: 45 }]}>
                      <Image src={rupee.src} style={{ width: 7, height: 7 }} /> {platformFee}
                    </Text>
                  </View>
                  <View
                    style={{
                      fontSize: 10,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderTop: 0,
                      borderColor: "#a1a1a1",
                      borderRightWidth: 0,
                    }}
                  >
                    <Text style={[styles.col, { borderRight: 0, textAlign: "left" }]}>Total</Text>
                    <Text style={[styles.col, { borderRight: 0, textAlign: "right", paddingRight: 45 }]}>
                      <Image src={rupee.src} style={{ width: 7, height: 7 }} /> {totalAmount + platformFee - order.discount}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.footer}>
                <Text style={styles.footer}>
                  Page {orderIndex + 1} of {orderData.length}
                </Text>
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default OrderFormDocument;
