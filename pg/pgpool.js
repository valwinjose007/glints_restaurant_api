var pg = require("pg");
var pool;
var config = {
  host: process.env["host"],
  user: process.env["user"],
  database: process.env["database"],
  password: process.env["password"],
  port: process.env["port"],
  max: 10,
  idleTimeoutMillis: 30000,
  ssl: {
    rejectUnauthorized: false,
    sslmode: "Require",
  },
};

const getPool = () => {
  if (pool) return pool; // if it is already there, grab it here
  pool = new pg.Pool(config);
  if (pool) return pool;
  else return console.error("DB connection Failed");
};

module.exports = {
  getPool,
};
