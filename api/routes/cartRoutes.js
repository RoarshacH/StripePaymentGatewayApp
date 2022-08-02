module.exports = function (app) {
  var carts = require("../controllers/cartController");

  //Routes
  app.route("/cart").get(carts.get_my_cart).post(carts.create_a_cart);
  app.route("/cart/:id").get(carts.get_a_cart).patch(carts.update_a_cart);
};
