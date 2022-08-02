var mongoose = require("mongoose");
require("dotenv").config();
var Cart = mongoose.model("Cart");
var CartItem = mongoose.model("CartItem");

// //Display all Courses
// exports.list_all_courses = (req, res) => {
//   Course.find({}, (err, task) => {
//     if (err) {
//       res.send(err);
//     }
//     res.json(task);
//   });
// };

exports.get_my_cart = (req, res) => {
  res.render("cart", { title: "My Cart", stripeKey: process.env.STRIPE_KEY });
};

//Create a New Course CourseName and CourseID is required
exports.create_a_cart = (req, res) => {
  var newCart = new Cart(req.body);
  newCart.save((err, task) => {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
};

//Update a exisiting course
exports.update_a_cart = (req, res) => {
  Cart.findOneAndUpdate({ CartID: req.params.id }, req.body, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
      console.log("Data updated!");
    }
  });
};

//Delete a Course Given the CourseID
exports.delete_a_cart = (req, res) => {
  Cart.deleteOne({ CourseID: req.params.id }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
};

//Display Course Given the CourseID
exports.get_a_cart = (req, res) => {
  Cart.findOne({ CartID: req.params.id }, (err, task) => {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
};