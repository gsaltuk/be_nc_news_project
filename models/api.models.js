//*** REQUIRES ***
const connection = require("../db/connection");
const fs = require("fs/promises");

//*** GET REQUESTS ***
exports.fetchApi = () => {
  return fs
    .readFile("./endpoints.json", "utf-8", (err, data) => {
      return data;
    })
    .then((data) => {
      return JSON.parse(data);
    });
};
