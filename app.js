const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getApi } = require("./controllers/api.controllers");
const {
  getCommentsByArticleId,
} = require("./controllers/comments.controllers");

const { getArticleById, getArticles, patchArticle } = require("./controllers/articles.controllers");
const app = express();

app.use(express.json())

//GET requests

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

//PATCH requests

app.patch("/api/articles/:article_id", patchArticle)

//Error Handling
//Incorrect Endpoint Errors

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Error - check endpoint and retry" });
});

//PSQL Errors

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  }
  next(err);
});

// Generic Errors

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

//500 Errors

app.use((err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).send({ msg: "Internal Server Error!" });
  }
  next(err);
});

module.exports = app;
