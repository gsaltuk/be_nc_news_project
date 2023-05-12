const connection = require("../db/connection");

exports.fetchUsers = () => {
  let queryStr = `
    SELECT * FROM users;
    `;
  return connection.query(queryStr).then((res) => {
    console.log(res.rows)
    return res.rows;
  });
};
