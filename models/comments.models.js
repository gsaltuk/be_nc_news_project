//*** REQUIRES ***
const connection = require("../db/connection");
const { checkArticleExists, checkCommentExists } = require("../db/seeds/utils");

//*** GET REQUESTS ***
exports.fetchCommentsByArticleId = (id) => {
  let queryStr = `
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `;
  return checkArticleExists(id).then(() => {
    return connection.query(queryStr, [id]).then((res) => {
      return res.rows;
    });
  });
};

//*** DELETE REQUESTS ***
exports.removeCommentById = (id) => {
  let queryStr = `
  DELETE FROM comments
  WHERE comment_id = $1;
  `;
  return checkCommentExists(id).then(() => {
    return connection.query(queryStr, [id]).then((res) => {});
  });
};

//*** POST REQUESTS ***
exports.createComment = (id, author, commentBody) => {
  const queryArr = [author, commentBody, id];
  let queryStr = `
  INSERT INTO comments
  (author, body, article_id)
  VALUES
  ($1, $2, $3)
  RETURNING *;
  `;

  if (!author) {
    return Promise.reject({ status: 400, msg: "author data required" });
  }
  if (!commentBody) {
    return Promise.reject({ status: 400, msg: "body data required" });
  }
  return checkArticleExists(id).then(() => {
    return connection.query(queryStr, queryArr).then((res) => {
      return res.rows;
    });
  });
};
