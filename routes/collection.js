const express = require("express");
const router = express.Router();
const Collection = require("../dal/collection");

//get list of collections.
router.get("/list", (req, res) => {
  Collection.getCollectionList()
    .then((data) => {
      res.status(200).send({
        status: "success",
        message: "Collection list retrived sucessfully.",
        data,
      });
    })
    .catch((err) => sendErrorResponse(err.message, res));
});

//add/ update a collection.
router.post("/add", (req, res) => {
  if (!req.body) sendErrorResponse("Mandatory parameters required.", res);

  const { collection_id, restaurant_id, collection_name } = req.body;
  if (!restaurant_id)
    sendErrorResponse("Mandatory parameter restaurant_id is required.", res);
  else if (!collection_id && !collection_name)
    sendErrorResponse("Mandatory parameter restaurant_id is required.", res);

  collection_id
    ? Collection.updateToCollection(collection_id, restaurant_id)
    .then((rowCount) => {
          if (rowCount > 0)
            res.status(200).send({
              status: "success",
              message: "Collection updated sucessfully.",
            });
          else sendErrorResponse("Something went wrong.", res);
        })
        .catch((err) => sendErrorResponse(err.message, res))
    : Collection.addToCollection(restaurant_id, collection_name)
        .then((rowCount) => {
          if (rowCount > 0)
            res.status(200).send({
              status: "success",
              message: "Collection added sucessfully.",
            });
          else sendErrorResponse("Something went wrong.", res);
        })
        .catch((err) => sendErrorResponse(err.message, res));
});

//get details of a collection.
router.post("/detail", (req, res) => {
  if (!req.body) sendErrorResponse("Mandatory parameters required.", res);

  const { collection_id } = req.body;
  if (!collection_id) {
    sendErrorResponse("Mandatory parameter collection_id is required.", res);
  }

  Collection.getCollectionDetailList(collection_id)
    .then((data) => {
      res.status(200).send({
        status: "success",
        message: "Collection details retrived sucessfully.",
        data,
      });
    })
    .catch((err) => sendErrorResponse(err.message, res));
});

sendErrorResponse = (message, res) => {
  console.error("COLLECTION ::", message);
  res.status(500).send({
    status: "error",
    message: message,
  });
};

module.exports = router;
