const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

if (ENV !== "production") require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

let config = {};

if (ENV === "production") {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not set in environment variables!");
  }
  config.connectionString = process.env.DATABASE_URL
  config.max = 2

  console.log("Connecting to production database");
} else {
  if (!process.env.PGDATABASE) throw new Error("PGDATABASE not set");

  console.log(`Connected to ${process.env.PGDATABASE}`);
}

const db = new Pool(config);
module.exports = db;
