//*** REQUIRES ***
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const connection = require("../db/connection");

// *** JEST SETUP ***
beforeEach(() => seed(testData));
afterAll(() => connection.end());

//*** API TESTS ***
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

//*** TOPICS TESTS ***
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

//*** ARTICLES TESTS ***
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
              comment_count: expect.any(Number),
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
            topic: expect.any(String),
            votes: expect.any(Number),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
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

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH - status 200 - returns status code 200 with updated object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((res) => {
        expect(res.body.updatedArticle.votes).toBe(101);
      });
  });
  test("Patch method works with larger number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 300 })
      .expect(200)
      .then((res) => {
        expect(res.body.updatedArticle.votes).toBe(400);
      });
  });
  test("Returns status 404 with error msg if article does not exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found!");
      });
  });
  test("Returns status 400 & error message if article_id input is not number", () => {
    return request(app)
      .patch("/api/articles/hello")
      .send({ inc_votes: 1 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input");
      });
  });
  test("Returns status 400 & error message if inc_votes value is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "incorrect data type" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Incorrect data type");
      });
  });
});

//* ARTICLE QUERY TESTS *

describe("GET QUERY /api/articles?topic=mitch", () => {
  test("GET - status 200 - Returns status code 200 and filtered articles array with specified query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((res) => {
        expect(res.body.articles.length).toBe(11);
        res.body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("GET - status 404 - Returns status code 404 with error msg if topic not found", () => {
    return request(app)
      .get("/api/articles?topic=nonsense")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Topic not found");
      });
  });
  test("GET - status 200 - Returns array sorted by sort_by query specified", () => {
    return request(app)
      .get("/api/articles?order=desc")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET - status 200 - Returns array sorted by sort_by & order query combined", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET - status 200 - Returns empty array when valid query but no results", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toEqual([]);
      });
  });
});

//*** COMMENTS TESTS ***
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
        expect(res.body.msg).toBe("Article not found!");
      });
  });
  test("Returns status 201 and posted comment object ignoring additonal properties", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "Totally agree, thank you for posting this",
        nonsense: "Testing value",
      })
      .expect(201)
      .then((res) => {
        expect(res.body.commentPosted).not.toHaveProperty("nonsense");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE - Status 204 - Returns status 204 and no content", () => {
    return request(app).delete("/api/comments/12").expect(204);
  });
  test("Returns status 400 and error message when id is not integer", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual("Invalid input");
      });
  });
  test("Returns status 404 and error message when id does not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual("Comment not found!");
      });
  });
});

//*** USERS TESTS ***
describe("GET /api/users", () => {
  test("GET - status 200 - Returns a status code 200 with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.users.length).toBe(4);
        expect(Array.isArray(res.body.users)).toBe(true);
        res.body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("GET - status 200 - Returns a status code 200 with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.msg).toBe();
      });
  });
});
