const passport = require("passport");
const User = require("../models/users");
const route = require("express").Router();
const saltRounds = 10;
const bcrypt = require('bcrypt');


route.get("/login", (req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  if (req.user) return res.redirect("/listings");
  res.render("login");
});

route.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/pgForBoys/admin",
  })
);

route.get("/signup", (req, res, next) => {
  res.render("signup");
});

// route.post("/signup", (req, res, next) => {
//   let newUser = new Users({
//     username: req.body.username,
//     password: req.body.password,
//   });
//   newUser.save().then((user) => {
//     console.log("Signup", user);
//     res.redirect("/login");
//   });
// });

route.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  let username = email;
  try {
      let user = await User.findOne({ username });
      if (user) {
          res.render('login', {
              msg: "User is Already Present"
          });
      }
      else {
          bcrypt.genSalt(saltRounds, async function (err, salt) {
              bcrypt.hash(password, salt, async function (err, hash) {
                  await User.create({
                      username,
                      password:hash
                  })
                  res.render('login', {
                      msg: "Signup Success"
                  });
              });
          });

      }
  }
  catch (err) {
      res.send(err);
      // console.log("error",err);
  }

})

route.get("/listings", (req, res, next) => {
  if (!req.user) {
    console.log(req);
    return res.redirect("/login");
  }
  console.log(req.session);
  console.log(req.user);
  res.render("listings", {
    username: req.user.username,
  });
});

route.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return new Error("Dikat hai logout mei");
    res.redirect("/login");
  });
});
module.exports = route;
