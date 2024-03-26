require('dotenv').config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("./passport");
// const { mongoConnect } = require("./database/database");
// const MongoDBStore = require("connect-mongodb-session")(session);
const app = express();
const PORT = process.env.PORT || 4445;
const hbs = require("hbs");
const postRouter = require("./routes/pg");
const allRoutes = require("./routes/routes");


app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.urlencoded({ extended: true }));

// const store = new MongoDBStore({
//   uri: "mongodb://localhost:27017/mydb",
//   collection: "sessions",
// });

app.use(
  session({
    secret: "adjkasdjkavdabm ma ",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));
// app.use("/login", allRoutes)
app.use("/platformAnchorage", postRouter);


app.use("/", allRoutes);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`http://localhost:` + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });