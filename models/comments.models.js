const connection = require("../db/connection");

exports.fetchCommentsByArticleId = (id) => {
  let queryStr = `
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `;
  return connection.query(queryStr, [id]).then((res) => {
    return res.rows;
  });
};
