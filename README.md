# NC News API — Backend

This is the backend API for my NC News project, built during the Northcoders Software Development Bootcamp.
It provides RESTful endpoints for accessing articles, topics, comments, and users.
It is designed to be consumed by the frontend application here:
https://github.com/DeathRiderAnt/nc-news.git



## Hosted API

Live API: https://nc-news-l6nr.onrender.com/api



## Tech Stack

* Node.js

* Express.js

* PostgreSQL

* pg & pg-format

* dotenv

* Jest & Supertest (for testing)



## Installation

Clone the repo:

git clone https://github.com/DeathRiderAnt/nc-news-BE.git
cd nc-news-BE


Install dependencies:

```npm install```



## Environment Variables

This project requires two .env files to connect to the correct databases.

Create the following files in the root directory:

.env.development
```PGDATABASE=nc_news```

.env.test
```PGDATABASE=nc_news_test```


Do NOT commit these files — they should be in your .gitignore.



## Database Setup & Seeding

Before running the server you must set up and seed your database:

```npm run setup-dbs```

```npm run seed```



## Running the Server

Start the server:

```npm start```


Or with nodemon (if installed):

```npm run dev```

Running Tests

Run all tests:

```npm test```


Run utility tests:

```npm run test-utils```



## API Endpoints
- GET /api

    - Returns a JSON object describing all available endpoints.

- GET /api/articles

    - Returns an array of article objects, sorted by date by default.

- GET /api/articles/:article_id

    - Returns a single article by ID.

- PATCH /api/articles/:article_id

    - Updates the vote count for an article.

- GET /api/articles/:article_id/comments

    - Returns all comments for the given article ID.

- POST /api/articles/:article_id/comments

    - Adds a new comment.

- DELETE /api/comments/:comment_id

    - Deletes a comment by ID.



## Acknowledgements

This project was created as part of the Northcoders Digital Skills Bootcamp.