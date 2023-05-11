const connection = require("../db/connection");
const { checkArticleExists } = require("../db/seeds/utils");

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

exports.removeCommentById = (id) => {
  let queryStr = `
  DELETE FROM comments
  WHERE comment_id = $1;
  `;
  return connection.query(queryStr, [id]).then((res) => {
    return res.rows;
  });
};
