const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const connection = require("../db/connection");

beforeEach(() => seed(testData));

afterAll(() => connection.end());

//API

describe("/api", () => {
  test("GET - status 200 - Returns status 200 with JSON object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(typeof res.body.result).toBe("object");
        expect(res.body.result).toHaveProperty("GET /api");
        expect(res.body.result).toHaveProperty("GET /api/topics");
        expect(res.body.result).toHaveProperty("GET /api/articles");
      });
  });
});

//TOPICS

describe("/api/topics", () => {
  test("GET - status 200 - Returns all topics in an array, with properties slug & description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.topics)).toBe(true);
        expect(res.body.topics.length).toBe(3);
        expect(res.body.topics[0]).toHaveProperty("slug");
        expect(res.body.topics[0]).toHaveProperty("description");
      });
  });
  test("GET - status 404 - Returns status 404 and error message when incorrect endpoint", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Error - check endpoint and retry");
      });
  });
});

//ARTICLES

describe("/api/articles", () => {
  test("GET - Status 200 - Returns status 200 with array of objects with included comment_count property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.articles)).toBe(true);
        res.body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              article_img_url: expect.any(String),
              author: expect.any(String),
              comment_count: expect.any(String),
              created_at: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("Object does not have body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.articles)).toBe(true);
        expect(res.body.articles[0]).toEqual(
          expect.not.objectContaining({
            body: expect.any(String),
          })
        );
      });
  });
  test("Returned array is sorted in DESC order", () => {
    return request(app)
      .get("/api/articles")
      .then((res) => {
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET - status 200 - Returns status 200 and correct article by id with correct key", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article.article_id).toBe(1);
        expect(res.body.article).toEqual(
          expect.objectContaining({
            title: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            votes: expect.any(Number),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
          })
        );
      });
  });
  test("GET - status 404 - Returns status 404 & error message if article_id does not exist", () => {
    return request(app)
      .get("/api/articles/150")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article does not exist");
      });
  });
  test("GET - status 400 - Returns status 400 & error message if article_id input is not number", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("POST - status 200 - Returns status 200 and posted comment object", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "Totally agree, thank you for posting this",
      })
      .expect(200)
      .then((res) => {
        expect(res.body.commentPosted[0]).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("Returns status 400 and error message when sent missing body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
      })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("body data required");
      });
  });
  test("Returns status 400 and error message when sent missing author", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "Totally agree, thank you for posting this",
      })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("author data required");
      });
  });
  test("Returns status 400 and error message when sent missing author", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({
        username: "butter_bridge",
        body: "Totally agree, thank you for posting this"
      })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found!");
      });
  });
});
