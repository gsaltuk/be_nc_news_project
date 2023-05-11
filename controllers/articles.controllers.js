const {
  fetchArticleById,
  fetchArticles,
  updateArticle,
} = require("../models/articles.models");

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
  fetchArticles()
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch((err) => {
      next(err);
    });
};

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
