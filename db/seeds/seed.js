const db = require("../connection")
const format = require("pg-format");
const { convertTimestampToDate,formatDataForSQL,createLookupObj } = require("./utils");
const { values } = require("../data/development-data/comments");

const seed = ({ topicData, userData, articleData, commentData }) => {
  const convertedTopic = topicData.map(convertTimestampToDate)
  const convertedUser = userData.map(convertTimestampToDate)
  const convertedArticle = articleData.map(convertTimestampToDate)
  const convertedComment = commentData.map(convertTimestampToDate)

  const formatTopic = formatDataForSQL(convertedTopic,['slug','description','img_url'])
  const formatUser = formatDataForSQL(convertedUser,['username', 'name', 'avatar_url'])
  const formatArticle = formatDataForSQL(convertedArticle,['title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url'])

  return db.query("DROP TABLE IF EXISTS comments")
    .then(() => {return db.query("DROP TABLE IF EXISTS articles")})
    .then(() => {return db.query("DROP TABLE IF EXISTS users")})
    .then(() => {return db.query("DROP TABLE IF EXISTS topics")})
    .then(() => {return db.query("CREATE TABLE topics (slug VARCHAR(50) PRIMARY KEY NOT NULL,description VARCHAR(50) NOT NULL,img_url VARCHAR(1000));")})
    .then(() => {return db.query("CREATE TABLE users (username VARCHAR(50) UNIQUE PRIMARY KEY,name VARCHAR(50),avatar_url VARCHAR(1000));")})
    .then(() => {return db.query("CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR(100), topic VARCHAR(50) REFERENCES topics(slug), author VARCHAR(50) REFERENCES users(username),body TEXT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,votes INT DEFAULT 0, article_img_url VARCHAR(1000));")})
    .then(() => {return db.query("CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(article_id), body TEXT NOT NULL, votes INT DEFAULT 0, author VARCHAR(50) REFERENCES users(username) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);")})
    .then(() => {return db.query(format(`INSERT INTO topics (slug, description, img_url) VALUES %L;`, formatTopic))})
    .then(() => {return db.query(format(`INSERT INTO users (username, name, avatar_url) VALUES %L;`, formatUser))})
    .then(() => {return db.query(format(`INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L;`, formatArticle))})
    .then(() => {return db.query(`SELECT * FROM articles`)})
    .then((result) => {
      const articlesData = result.rows
      const lookupArticle = createLookupObj(articlesData,'title','article_id')

      const commentsWithId = convertedComment.map(comment => {
        return {...comment, article_id: lookupArticle[comment.article_title]}
      })

      const formatComment = formatDataForSQL(commentsWithId,['article_id', 'body', 'votes', 'author', 'created_at'])

      return db.query(format(`INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L;`, formatComment))
    })
};
module.exports = seed;

