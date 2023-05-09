const {
  fetchTopics,
  fetchApi,
  fetchArticleById,
} = require("../models/topics.models");

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
      res.status(200).send({ result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;

  if (isNaN(id)) {
    return res.status(404).send({ msg: "Please only input number" });
  }

  fetchArticleById(id)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};
