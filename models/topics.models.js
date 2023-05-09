const connection = require("../db/connection");
const fs = require("fs/promises");

exports.fetchTopics = () => {
  return connection.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.fetchApi = () => {
  return fs
    .readFile("./endpoints.json", "utf-8", (err, data) => {
      return data;
    })
    .then((data) => {
      return JSON.parse(data);
    });
};

exports.fetchArticleById = (id) => {
  return connection.query(`
    SELECT * FROM articles
    WHERE article_id = $1;`, [id]).then((result) =>{
        if(result.rows.length === 0) {
            return Promise.reject({status: 404, msg: "Article does not exist"})
        }
        return result.rows
    });
};
