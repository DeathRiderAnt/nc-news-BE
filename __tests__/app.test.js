const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("should return a status code of 200 and an object with the key of topics and the value of an array of topic objects", () => {
    const expected = {
      topics: [
        {
          description: "The man, the Mitch, the legend",
          slug: "mitch",
        },
        {
          description: "Not dogs",
          slug: "cats",
        },
        {
          description: "what books are made of",
          slug: "paper",
        },
      ],
    };

    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(expected);
      });
  });
});

describe("GET /api/articles", () => {
  test("should return a status code of 200 and an object", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
      });
  });
  test("body object should have an array of article objects with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBeGreaterThan(0);
        for (const article of body.articles) {
          expect(article).toBeInstanceOf(Object);
        }
      });
  });
  test("each object in the array should have the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        for (const article of body.articles) {
          const { article_id, title, topic, author, created_at, votes, article_img_url, comment_count } = article;
          expect(typeof article_id).toBe("number");
          expect(typeof topic).toBe("string");
          expect(typeof title).toBe("string");
          expect(typeof author).toBe("string");
          expect(typeof created_at).toBe("string");
          expect(typeof votes).toBe("number");
          expect(typeof article_img_url).toBe("string");
          expect(typeof comment_count).toBe("number");
        }
      });
  });
  test("objects in the array should be in descending order of created_at", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body}) => {
        const articles = body.articles
        for (let i = 0; i < articles.length - 1; i++)
        {
          expect(Date.parse(articles[i].created_at)).toBeGreaterThanOrEqual(Date.parse(articles[i + 1].created_at))
        }
      })
  })
  test('should accept sort_by query and default to created_at', () => {
    return request(app)
      .get("/api/articles?sort_by")
      .expect(200)
      .then(({body}) => {
        const articles = body.articles
        for (let i = 0; i < articles.length - 1; i++)
        {
          expect(Date.parse(articles[i].created_at)).toBeGreaterThanOrEqual(Date.parse(articles[i + 1].created_at))
        }
      })
  });
  test('should accept sort_by query and arrange by requested column', () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({body}) => {
        const articles = body.articles
        expect(articles).toBeSortedBy('author', {descending: true})
      })
  });
  test('should accept sort_by and order queries and arrange by requested column', () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({body}) => {
        const articles = body.articles
        expect(articles).toBeSortedBy('author', {descending: false})
      })
  });
  test('should return a 400 and message if sort_by is invalid', () => {
    return request(app)
      .get("/api/articles?sort_by=auther")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('Invalid sort_by request')
      })
  });
  test('should return a 400 and message if order is invalid', () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=desk")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('Invalid order request')
      })
  });
  test('should accept a topic query and return articles by topic', () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({body}) => {
        const articles = body.articles
        expect(articles.length).toBeGreaterThan(0)
        for(const article of articles)
        {
          expect(article.topic).toBe('mitch')
        }
      })
  })
  test('should return an empty array when requesting a topic that has no articles', () => {
    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({body}) => {
        const articles = body.articles
        expect(body).toBeInstanceOf(Object)
        expect(articles).toBeInstanceOf(Array)
        expect(articles.length).toBe(0)
      })
  })
  test('should return a 404 and message if valid topic is not in db', () => {
    return request(app)
      .get('/api/articles?topic=news')
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe('Not Found')
      })
  });
});

describe("GET /api/users", () => {
  test("should return a status code of 200 and return an object with a key of users and the value of an array of user objects", () => {
    const expected = {
      users: [
        {
          username: "butter_bridge",
          name: "jonny",
          avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        },
        {
          username: "icellusedkars",
          name: "sam",
          avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        },
        {
          username: "rogersop",
          name: "paul",
          avatar_url: "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
        },
        {
          username: "lurker",
          name: "do_nothing",
          avatar_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        },
      ],
    };

    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(expected);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("should return a status code of 200 and return an object with the key of article and the value of an article object", () => {
    const expected = {
      article: {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: "2020-11-03T09:12:00.000Z",
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        comment_count: 2
      },
    };
    return request(app).get('/api/articles/3')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(expected)
        })
  });
  test('should return a status code of 404 with a message when passed a valid id that does not exist in the db', () => {
    return request(app).get('/api/articles/900')
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Not Found")
        })
  });
  test('should return a status code of 400 with a message when passed an invalid id', () => {
    return request(app).get('/api/articles/news')
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad Request")
        })
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test('should return a status code of 200, with an object with a comments property with an array of comments for the given article_id', () => {
    return request(app).get('/api/articles/3/comments')
      .expect(200)
      .then(({body}) => {
        expect(body).toBeInstanceOf(Object)
        expect(body.comments).toBeInstanceOf(Array)
        expect(body.comments.length).toBeGreaterThan(0)
      })
  });
  test('comment objects in the array should have the correct properties', () => {
    return request(app).get('/api/articles/3/comments')
      .expect(200)
      .then(({body}) => {
        for(const comment of body.comments)
        {
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number)
          })
          expect(comment.article_id).toBe(3)
        }
      })
  });
  test('comments should be in descending order of created_at', () => {
    return request(app).get('/api/articles/3/comments')
      .expect(200)
      .then(({body}) => {
        const comments = body.comments
        for (let i = 0; i < comments.length - 1; i++)
        {
          expect(Date.parse(comments[i].created_at)).toBeGreaterThan(Date.parse(comments[i + 1].created_at))
        }
      })
  });
  test('should return a status code of 200, with an object with an empty array when article exists but no comments found', () => {
    return request(app).get('/api/articles/2/comments')
      .expect(200)
      .then(({body}) => {
        expect(body).toBeInstanceOf(Object)
        expect(body.comments).toBeInstanceOf(Array)
        expect(body.comments.length).toBe(0)
      })
  });
  test('should return a status code of 404 with a message when passed a valid id that does not exist in the db', () => {
    return request(app).get('/api/articles/900/comments')
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Not Found")
        })
  });
  test('should return a status code of 400 with a message when passed an invalid id', () => {
    return request(app).get('/api/articles/news/comments')
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad Request")
        })
  });
})

describe('POST /api/articles/:article_id/comments', () => {
  test('should accept an object with a username and body, and respond with the posted comment and a status code of 201', () => {
    const newComment = {author: 'icellusedkars', body: "It's over 9000!"}
    return request(app).post('/api/articles/3/comments').send(newComment)
      .expect(201)
      .then(({body}) => {
        expect(newComment).toBeInstanceOf(Object)
        expect(newComment).toHaveProperty('author')
        expect(newComment).toHaveProperty('body')
        expect(body).toBeInstanceOf(Object)
          expect.objectContaining(
              {comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number)})
        expect(body.article_id).toBe(3)
      })
  });
  test('should return a status code of 400 when making a request with a body of incorrect properties', () => {
    const newComment = {name: 'icellusedkars', filler: "It's over 9000!"}
    return request(app).post('/api/articles/3/comments').send(newComment)
      .expect(400)
      .then(({body}) => {
        expect(newComment).toBeInstanceOf(Object)
        expect(body.msg).toBe("Bad Request")
      })
  });
  test('should return a status code of 400 when making a request with valid properties, but invalid values', () => {
    const newComment = {author: true, body: 9001}
    return request(app).post('/api/articles/3/comments').send(newComment)
      .expect(400)
      .then(({body}) => {
        expect(newComment).toBeInstanceOf(Object)
        expect(newComment).toHaveProperty('author')
        expect(newComment).toHaveProperty('body')
        expect(body.msg).toBe("Bad Request")
      })
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('should return a status code of 200 and increment an articles vote value when passed a positive vote integer', () => {
    const newVote = {inc_votes: 5}
    return request(app).patch('/api/articles/3').send(newVote)
      .expect(200)
      .then(({body}) => {
        expect(body.votes).toBe(5)
        expect(body.article_id).toBe(3)
      })
  });
  test('should return a status code of 200 and decrement an articles vote value when passed a negative vote integer', () => {
    const newVote = {inc_votes: -5}
    return request(app).patch('/api/articles/1').send(newVote)
      .expect(200)
      .then(({body}) => {
        expect(body.votes).toBe(95)
        expect(body.article_id).toBe(1)
      })
  });
  test('should return a status code of 400 when making a request with a body of incorrect properties', () => {
    const newVote = {}
    return request(app).patch('/api/articles/3').send(newVote)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad Request")
      })
  });
  test('should return a status code of 400 when making a request with valid properties, but invalid values', () => {
    const newVote = {inc_votes: 'five'}
    return request(app).patch('/api/articles/3').send(newVote)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad Request")
      })
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('should resolve with a status code of 204 upon successful deletion of a comment', () => {
    return request(app).delete('/api/comments/2')
      .expect(204)
      .then(({body}) => {
        expect(body).toEqual({})
      })
  });
  test('should return a status code of 404 with a message when passed a valid id that does not exist in the db', () => {
    return request(app).delete('/api/comments/50')
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Not Found")
        })
  });
  test('should return a status code of 400 with a message when passed an invalid id', () => {
    return request(app).delete('/api/comments/five')
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad Request")
        })
  });
}); 