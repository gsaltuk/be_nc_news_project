const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getApi } = require("./controllers/api.controllers");
const { getArticleById } = require("./controllers/articles.controllers");
const app = express();

//GET requests

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);


//Error Handling

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Error - check endpoint and retry" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

app.use((err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).send({ msg: "Internal Server Error!" });
  }
  next(err);
});

module.exports = app;
