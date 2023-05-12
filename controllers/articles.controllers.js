//*** REQUIRES ***
const {
  fetchArticleById,
  fetchArticles,
  updateArticle,
} = require("../models/articles.models");

//*** GET REQUESTS ***
exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticleById(id)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  console.log(req)
  const topicQuery = req.query.topic;
  const sort_by = req.query.sort_by || "created_at";
  const order = req.query.order || "desc"
  console.log(topicQuery)
  console.log(sort_by)
  console.log(order)
  fetchArticles(sort_by, order, topicQuery)
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch((err) => {
      next(err);
    });
};

//*** PATCH REQUESTS ***
exports.patchArticle = (req, res, next) => {
  const id = req.params.article_id;
  const voteInc = req.body.inc_votes;
  updateArticle(id, voteInc)
    .then((result) => {
      res.status(200).send({ updatedArticle: result });
    })
    .catch((err) => {
      next(err);
    });
};
