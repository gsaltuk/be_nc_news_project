const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const connection = require("../db/connection");

beforeEach(() => seed(testData));

afterAll(() => connection.end());

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

describe("/api/articles/:article_id", () => {
  test("GET - status 200 - Returns status 200 and correct article by id with correct key", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article.article_id).toBe(1);
        expect(res.body.article).toHaveProperty("title");
        expect(res.body.article).toHaveProperty("author");
        expect(res.body.article).toHaveProperty("body");
        expect(res.body.article).toHaveProperty("votes");
        expect(res.body.article).toHaveProperty("article_id");
        expect(res.body.article).toHaveProperty("created_at");
        expect(res.body.article).toHaveProperty("article_img_url");
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
        console.log;
        expect(res.body.msg).toBe("Invalid input");
      });
  });
});
