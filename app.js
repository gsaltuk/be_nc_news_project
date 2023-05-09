const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);



app.all("*", (req, res) => {
  res.status(404).send({msg: "Error - check endpoint and retry"});
});

module.exports = app;
