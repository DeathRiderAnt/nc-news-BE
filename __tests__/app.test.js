const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(data))

afterAll(() => db.end())

describe('GET /api/topics', () => {
    test('should return a status code of 200 and an object with the key of topics and the value of an array of topic objects', () => {
        const expected = {topics:[
        {
            description: 'The man, the Mitch, the legend',
            slug: 'mitch'
        },
        {
            description: 'Not dogs',
            slug: 'cats'
        },
        {
            description: 'what books are made of',
            slug: 'paper'
        }
        ]}

        return request(app).get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(expected)
        }) 
    });
});

describe('GET /api/articles', () => {
    test('should return a status code of 200 and an object', () => {
        return request(app).get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body).toBeInstanceOf(Object)
        })
    });
    test('body object should have an array of article objects with the correct properties', () => {
        return request(app).get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBeGreaterThan(0)
            for(const article of body.articles)
            {
                expect(article).toBeInstanceOf(Object)
            }
        })
    });
    test('each object in the array should have the correct properties', () => {
        return request(app).get('/api/articles')
        .expect(200)
        .then(({body}) => {
            for(const article of body.articles)
            {
                const {article_id, title, topic, author, created_at, votes, article_img_url, comment_count} = article
                expect(typeof article_id).toBe('number')
                expect(typeof topic).toBe('string')
                expect(typeof title).toBe('string')
                expect(typeof author).toBe('string')
                expect(typeof created_at).toBe('string')
                expect(typeof votes).toBe('number')
                expect(typeof article_img_url).toBe('string')
                expect(typeof comment_count).toBe('string')
            }
        })
    });
});

describe('GET /api/users', () => {
    test('should return a status code of 200 and return an object with a key of users and the value of an array of user objects', () => {
        const expected = {users:[
        {
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
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
            avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        },
        ]}

        return request(app).get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(expected)
        })
    });
});