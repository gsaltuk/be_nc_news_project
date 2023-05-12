//*** REQUIRES ***
const connection = require("../db/connection");
const { checkArticleExists } = require("../db/seeds/utils");

//*** GET REQUESTS ***
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
  let queryStr = `
  SELECT articles.article_id, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC;
  `;
  return connection.query(queryStr).then((result) => {
    return result.rows;
  });
};

//*** PATCH REQUESTS ***
exports.updateArticle = (id, voteInc) => {
  let selectQuer = `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;
  `;
  if (typeof voteInc !== "number") {
    return Promise.reject({ status: 400, msg: "Incorrect data type" });
  }
  return checkArticleExists(id).then(() => {
    return connection.query(selectQuer, [voteInc, id]).then((res) => {
      return res.rows[0];
    });
  });
};
