const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const connection = require("../db/connection");

beforeEach(() => seed(testData));

afterAll(() => connection.end());

//API

describe("GET /api", () => {
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

describe("GET /api/topics", () => {
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
  test("Returns status 404 and error message when incorrect endpoint", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Error - check endpoint and retry");
      });
  });
});

//ARTICLES

describe("GET /api/articles", () => {
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

describe("GET /api/articles/:article_id", () => {
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
  test("Returns status 404 & error message if article_id does not exist", () => {
    return request(app)
      .get("/api/articles/150")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article does not exist");
      });
  });
  test("Returns status 400 & error message if article_id input is not number", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/articles/:article_id/comments ", () => {
  test("GET - status 200 - Returns array of comment objects for correct article_id sorted by created_at DESC", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.comments)).toBe(true);
        expect(res.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
        res.body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              body: expect.any(String),
              author: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
      });
  });
  test("Returns status 404 and error msg if article does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found!");
      });
  });
  test("Returns status 200 and empty array if article exists but no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((res) => {
        console.log(res.body);
        expect(res.body.comments).toEqual([]);
      });
  });
  test("Returns status 400 and error msg if incorrect article format", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST - status 201 - Returns status 201 and posted comment object", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "Totally agree, thank you for posting this",
      })
      .expect(201)
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
  test("Returns status 404 and error message when username not found", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "mrsaltuk",
        body: "Totally agree, thank you for posting this",
      })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Username not found");
      });
  });
  test("Returns status 404 and error message when article does not exist", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({
        username: "butter_bridge",
        body: "Totally agree, thank you for posting this",
      })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found");
      });
  });
  test("Returns status 201 and posted comment object ignoring additonal properties", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "Totally agree, thank you for posting this",
        nonsense: "Testing value"
      })
      .expect(201)
      .then((res) => {
        expect(res.body.commentPosted).not.toHaveProperty("nonsense");
      });
  });
});
