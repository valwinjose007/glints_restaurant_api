require("dotenv").config({ path: __dirname + "/.env" });
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
//modules
const restaurant = require("./routes/restaurant");
const collection = require("./routes/collection");
const restaurant_upload = require("./routes/restaurant_upload");
//app setup
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //parse json request.
app.use(cors());

if (!process.env["host"]) {
  console.error("FATAL ERROR: host is not defined.");
  process.exit(1);
} else if (!process.env["user"]) {
  console.error("FATAL ERROR: user is not defined.");
  process.exit(1);
} else if (!process.env["database"]) {
  console.error("FATAL ERROR: database is not defined.");
  process.exit(1);
} else if (!process.env["password"]) {
  console.error("FATAL ERROR: password is not defined.");
  process.exit(1);
}

const baseUrl = "/api/v1";
app.use(`${baseUrl}/upload`, restaurant_upload);
app.use(`${baseUrl}/restaurant`, restaurant);
app.use(`${baseUrl}/collection`, collection);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Restaurant API listioning prot...", port);
});
