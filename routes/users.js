/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    db.query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [req.body.name, req.body.email, bcrypt.hashSync(req.body.password, 10)]
    )
      .then((data) => {
        const users = data.rows;
        console.log(users);
        res.send("added user!");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
