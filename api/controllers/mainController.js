const stripe = require("stripe")(process.env.STRIPE_SECRET);
require("dotenv").config();
const fs = require("fs");

exports.fetch_home = (req, res) => {
  res.render("home", { title: "Shopping App", auth: req.oidc.isAuthenticated() ? "Logged in" : "Logged out" });
};

exports.fetch_products = (req, res) => {
  fs.readFile("../../items.json", function (error, data) {
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
};

exports.start_stripe_payment = (req, res) => {
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
};
