//*** REQUIRES ***
const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getApi } = require("./controllers/api.controllers");
const {
  getCommentsByArticleId,
  deleteCommentById,
  postComments
} = require("./controllers/comments.controllers");
const {
  getArticleById,
  getArticles,
  patchArticle,
} = require("./controllers/articles.controllers");
const app = express();


//*** JSON PARSER ***
app.use(express.json());


//*** GET REQUESTS ***
app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

//*** DELETE REQUESTS ***
app.delete("/api/comments/:comment_id", deleteCommentById);

//*** PATCH REQUESTS ***
app.patch("/api/articles/:article_id", patchArticle);

//*** POST REQUESTS ***
app.post("/api/articles/:article_id/comments", postComments);

//*** ERROR HANDLING ***
//*** INCORRECT ENDPOINT ERRORS ***
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Error - check endpoint and retry" });
});

//*** PSQL ERRORS ***
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503" && err.detail.includes("(article_id)")) {
    res.status(404).send({ msg: "Article not found" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503" && err.detail.includes("(author)")) {
    res.status(404).send({ msg: "Username not found" });
  }
  next(err);
});

//*** GENERAL ERRORS ***

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

//*** 500 ERRORS ***

app.use((err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).send({ msg: "Internal Server Error!" });
  }
  next(err);
});

module.exports = app;
