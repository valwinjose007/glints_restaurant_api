const express = require("express");
const router = express.Router();
const Restaurant = require("../dal/restaurant");

//get the default list of restaurants.
router.get("/list", (req, res) => {
  Restaurant.getRestaurantList(req)
    .then((data) => {
      res.status(200).send({
        status: "success",
        message: "Restaurants retrived sucessfully.",
        data,
      });
    })
    .catch((err) => {
      console.log(err);
      sendErrorResponse(err.message, res);
    });
});

//Get restaurants from the list of restaurant id's
router.post("/getRestaurants", (req, res) => {
  if (!req.body) sendErrorResponse("Mandatory parameters required.", res);

  const { restaurants } = req.body;
  if (!restaurants && restaurants.length > 0)
    sendErrorResponse("Mandatory parameter restaurants is required.", res);

  Restaurant.getRestaurants(restaurants)
    .then((data) => {
      res.status(200).send({
        status: "success",
        message: "Restaurants retrived sucessfully.",
        data,
      });
    })
    .catch((err) => sendErrorResponse(err.message, res));
});

//search restaurants by name or open daytime.
router.post("/search", (req, res) => {
  if (!req.body) sendErrorResponse("Mandatory parameters required.", res);
  const {
    restaurantName,
    restaurantOpenByDay,
    restaurantOpenByStartTime,
    restaurantOpenByEndTime,
  } = req.body;

  Restaurant.searchRestaurantList(
    restaurantName,
    restaurantOpenByDay,
    restaurantOpenByStartTime,
    restaurantOpenByEndTime
  )
    .then((data) => {
      res.status(200).send({
        status: "success",
        message: "Restaurants retrived sucessfully.",
        data,
      });
    })
    .catch((err) => {
      console.log(err);
      sendErrorResponse(err.message, res);
    });
});

sendErrorResponse = (message, res) => {
  console.error("RESTAURANT ::", message);
  res.status(500).send({
    status: "error",
    message: message ? message : "Something went wrong!",
  });
};

module.exports = router;
