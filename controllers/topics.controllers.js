const { fetchTopics, fetchApi } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((result) => {
      res.status(200).send({ topics: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getApi = (req, res, next) => {
  fetchApi()
    .then((result) => {
      const parsedResult = JSON.parse(result);
      res.status(200).send({ result: parsedResult });
    })
    .catch((err) => {
      next(err);
    });
};
