//*** REQUIRES ***
const connection = require("../db/connection");

//*** GET REQUESTS ***
exports.fetchTopics = () => {
  return connection.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};
