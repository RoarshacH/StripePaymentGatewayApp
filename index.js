const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
// const request = require("request");
// const invert = require("invert-color");

const app = express();
// Ejs and bodyParser
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

let title = "Stripe Web App";

// OAuth
const { auth, requiresAuth } = require("express-openid-connect");
app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
  })
);

// Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET);

app.get("/", function (req, res) {
  res.render("home", { title: title, auth: req.oidc.isAuthenticated() ? "Logged in" : "Logged out" });
});

app.get("/products", function (req, res) {
  res.render("products", { title: "Products Page" });
});

app.get("/cart", function (req, res) {
  res.render("cart", { title: "My Cart", stripeKey: process.env.STRIPE_KEY });
});

app.post("/payment", function (req, res) {
  // Moreover you can take more details from user
  // like Address, Name, etc from form
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: "Test User",
      address: {
        line1: "TC Barrie",
        postal_code: "L4M 0A3",
        city: "Barrie",
        state: "Ontario",
        country: "Canada",
      },
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: 2000, // Charing money
        description: "Web Development Product",
        currency: "CAD",
        customer: customer.id,
      });
    })
    .then((charge) => {
      res.send("Success"); // If no error occurs
    })
    .catch((err) => {
      res.send(err); // If some error occurs
    });
});

// app.post("/", function (req, res) {
//   items.push(req.body.newInput);
//   title = req.body.newInput;
//   var option = {
//     url: "http://api.creativehandles.com/getRandomColor",
//     method: "GET",
//   };
//   request(option, function (error, response, body) {
//     var data = JSON.parse(body);
//     colours.push(data.color);
//     invertCol.push(invert(data.color));
//   });
//   res.redirect("/");
// });

app.listen(3000, function () {
  console.log("Server online at port 3000");
});
