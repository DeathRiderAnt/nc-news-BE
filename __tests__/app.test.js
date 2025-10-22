const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(data))

afterAll(() => db.end())

describe('GET /api/topics', () => {
    test('should return a status code of 200 and return an array of topic objects', () => {
        const expected = [
        {
            description: 'The man, the Mitch, the legend',
            slug: 'mitch',
            img_url: ""
        },
        {
            description: 'Not dogs',
            slug: 'cats',
            img_url: ""
        },
        {
            description: 'what books are made of',
            slug: 'paper',
            img_url: ""
        }
        ]

        return request(app).get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(expected)
        }) 
    });
});