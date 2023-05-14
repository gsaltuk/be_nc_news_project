# Northcoders News API

## Project Overview

---

<br/>
This repo is a RESTful API that serves as the backend architecture for a Reddit-style Northcoders News Web Application. It is built using Node.js and Express.js and uses PostgreSQL as its database. The API allows users to interact with the application by performing full CRUD (Create, Read, Update, Delete) operations on articles, comments, and users.
<br/><br/>

This API will serve as the backend for a frontend project built with [***React.js***](https://react.dev/).
<br/><br/>

A live version of this app is available [**here**](https://nc-news-gs.onrender.com/api), hosted with Render.
<br/><br/>
### **Tech Stack** Javascript, Expres.js, Node.js, PostgreSQL
<br>

| <img src="dev-icons/javascript-plain.svg" width="100"/> | <img src="dev-icons/express-original.svg" width="100"/> | <img src="dev-icons/nodejs-original.svg" width="100"/> | <img src="dev-icons/postgresql-plain.svg" width="100"/> |
| :------------------------------------------------------: | :----------------------------------------------------: | :--------------------------------------------------: | :-------------------------------------------------------: |

<br></br>

## **Setup**
---

*Follow the instructions below to get started*
<br></br>
### **Minimum requirements:**

- [**Node.js**](https://nodejs.org/en/download): *v19.7.0*
- [**PostgreSQL**](https://www.postgresql.org/download/): *v14.7*
<br></br>

### **Clone this repository locally**
*In your terminal, create a new directory:*
```
$ mkdir <new-directory-name>
```
*Navigate to this directory:*
```
$ cd <new-directory-name>
```
*Clone this repository:*
```
$ git clone https://github.com/gsaltuk/be_nc_news_project.git
```

<br>

### **Install dependencies**
```
$ npm install
$ npm install -D jest
$ npm install -D jest-sorted
```
<br>

### **Create and setup environment variables**
*Create two .env files:*
```
$ touch .env.development
$ touch .env.test
```
**.env.development** *should contain the following:-*
```
PGDATABASE=nc_news
```
**.env.test** *should contain the following:-*
```
PGDATABASE=nc_news_test
```
<br>

### **Create and seed the databases**
*Run the following code to setup and seed both the development and test databases:*
```
$ npm run setup-dbs
$ npm run seed
```
<br>

## **API Endpoints**

---

*Users are able to access and interact with the data using the following **endpoints***:

**GET** /api/topics

- Returns a list of topics

<br/>


**GET** /api/users

- Returns a list of users

<br>

**GET** /api/articles

- Returns a list of articles
  <br>
- Can be used with optional queries _sort_by_ & _topic_

<br/>


**GET** /api/articles/:article_id

- Returns the specified article

<br/>

**GET** /api/articles/:article_id/comments

- Returns a list of comments from a specified article

<br/>

**POST** /api/articles/:article_id/comments

- Inserts a comment into the specified article and returns comment
- Example request body:-

```
{   "username": "butter_bridge",
    "body": "Totally agree, thank you for posting this" };
```

- Example response:-

```
{   "comment_id": 19,
    "body": "Totally agree, thank you for posting this",
    "article_id": 1,
    "author": "butter_bridge",
    "votes": 0,
    "created_at": "2023-05-14T07:34:30.053Z"    };
```

<br/>

**PATCH** /api/articles/:article_id

- Updates a specified articles vote count and returns updated article
- Example request body:-

```
{ "inc_votes": 1 }
```

- Example response:-

```
{   "article_id": 1,
    "title": "Living in the shadow of a great man",
    "topic": "mitch",
    "author": "butter_bridge",
    "body": "I find this existence challenging",
    "created_at": "2020-07-09T20:11:00.000Z",
    "votes": 101,
    "article_img_url": "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"  };
```

<br/>

**DELETE** /api/comments/:comment_id

- Deletes specified comment

<br/><br/>
<br/><br/>
