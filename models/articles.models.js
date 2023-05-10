const connection = require("../db/connection");

exports.fetchArticleById = (id) => {
  let queryStr = `SELECT * FROM articles
         WHERE article_id = $1;`;
  return connection.query(queryStr, [id]).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article does not exist" });
    }
    return res.rows[0];
  });
};

exports.fetchArticles = () => {
  
}
