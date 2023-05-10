const { fetchCommentsByArticleId } = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  fetchCommentsByArticleId(id)
    .then((result) => {
      res.status(200).send({ comments: result });
    })
    .catch((err) => {
      next(err);
    });
};
