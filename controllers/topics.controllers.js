const { fetchTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((result) => {
      console.log("IN CONTROLLER");
      res.status(200).send({ topics: result });
    })
    .catch((err) => {
      next(err);
    });
};
