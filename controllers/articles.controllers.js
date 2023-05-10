const { fetchArticleById } = require("../models/articles.models");

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