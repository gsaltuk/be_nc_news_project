const { createComment } = require("../models/comments.models");
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

exports.postComments = (req, res, next) => {
  const id = req.params.article_id;
  const author = req.body.username;
  const commentBody = req.body.body;
  createComment(id, author, commentBody).then((result) => {
    return res.status(200).send({commentPosted: result})
  }).catch((err) => {
    console.log(err)
    next(err)
  })
};
