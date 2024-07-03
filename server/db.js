const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Jb50055007",
  host: "localhost",
  port: 5432,
  database: "arsalanparking",
});

module.exports = pool;
