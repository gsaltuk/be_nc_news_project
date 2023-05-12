const connection = require("../db/connection");

exports.fetchUsers = () => {
  let queryStr = `
    SELECT * FROM users;
    `;
  return connection.query(queryStr).then((res) => {
    return res.rows;
  });
};
