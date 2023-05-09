const express = require("express");
const { getTopics, getApi, getArticleById } = require("./controllers/topics.controllers");
const app = express();

//GET requests

app.get("/api/topics", getTopics);
app.get("/api", getApi)
app.get('/api/articles/:article_id', getArticleById)


//Error Handling

app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
})
app.all("*", (req, res) => {
  res.status(404).send({msg: "Error - check endpoint and retry"});
});

module.exports = app;
