const fs = require("fs");
var { parse } = require("csv-parse");
const express = require("express");
const restaurant = require("../dal/restaurant");
const router = express.Router();

router.get("/restaurant", (req, res) => {
  const fullList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  //iterate each row
  fs.createReadStream("source/hours.csv")
    .pipe(parse({ delimiter: "," }))
    .on("data", (row) => {
      let restaurant_name = row[0];
      let restaurant_open_hours = row[1];
      let ins_restaurant_id = 0;
      let data_upload_restaurant = {
        restaurant_name: restaurant_name,
        opening_hours: restaurant_open_hours,
      };

      //save restaurant name and raw opening hours.
      restaurant
        .uploadRestaurants(data_upload_restaurant)
        .then((res_upload_restaurant) => {
          if (!res_upload_restaurant && !res_upload_restaurant[0])
            res.status(500).send({
              status: "error",
              message: "Something went wrong. Please try again!",
            });
          ins_restaurant_id = res_upload_restaurant[0].restaurant_id;

          let open_hour_array = restaurant_open_hours.split("/");
          open_hour_array.forEach((elm2) => {
            let open_hour_array2 = elm2.trimEnd().split(" ");
            let from =
              open_hour_array2[open_hour_array2.length - 5] +
              open_hour_array2[open_hour_array2.length - 4];
            if (!from.includes(":"))
              from = from.replace("am", ":00am").replace("pm", ":00pm");
            let to =
              open_hour_array2[open_hour_array2.length - 2] +
              open_hour_array2[open_hour_array2.length - 1];
            if (!to.includes(":"))
              to = to.replace("am", ":00am").replace("pm", ":00pm");
            let array3 = open_hour_array2.slice(0, -5);

            let opening_days = [];
            array3.forEach((elm3) => {
              elm3 = elm3.replace(",", "");
              let arr1 = elm3.split("-");
              fullList.forEach((day, index) => {
                if (
                  arr1.length === 1 &&
                  index === fullList.lastIndexOf(arr1[0])
                ) {
                  opening_days.push(day);
                } else if (
                  index >= fullList.lastIndexOf(arr1[0]) &&
                  index <= fullList.lastIndexOf(arr1[1])
                ) {
                  opening_days.push(day);
                } else {
                  //nothing to do
                }
              });
            });

            //save restaurant schedule to schedule table.
            let data = {
              restaurant_id: ins_restaurant_id,
              opening_days: opening_days,
              opening_time: from,
              closing_time: to,
            };
            restaurant
              .uploadSchedule(data)
              .then((response) => {
                //Do nothing
              })
              .catch((err) => console.error(err));
          });
        })
        .catch((err) => console.error(err));
    })
    .on("end", () => {
      res.status(200).send({
        status: "success",
        message: "Restaurants uploaded sucessfully.",
      });
    });
});

module.exports = router;
