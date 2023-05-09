const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection.query(`SELECT * FROM topics;`).then((result) => {
    console.log("IN MODEL")
    return result.rows;
  });
};
