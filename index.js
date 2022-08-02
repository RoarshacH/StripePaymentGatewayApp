const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const fs = require("fs");
const InitiateMongoServer = require("./db");

InitiateMongoServer();

var Cart = require("./api/model/cartModel");

const app = express();
// Ejs and bodyParser
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
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

app.get("/products", function (req, res) {
  fs.readFile("items.json", function (error, data) {
    if (error) {
      res.status(500).end();
    } else {
      res.render("products", {
        stripePublicKey: process.env.STRIPE_KEY,
        items: JSON.parse(data),
        title: "Products Page",
      });
    }
  });
  // res.render("products", { title: "Products Page" });
});

var cartRoutes = require("./api/routes/cartRoutes");
var mainRoutes = require("./api/routes/mainRoutes");
mainRoutes(app);
cartRoutes(app);

app.listen(3000, function () {
  console.log("Server online at port 3000");
});
