const db = require('./db/connection.js');

return db.query(`SELECT * FROM comments`).then((result) => {console.log(result.rows)})