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
  //Get User Profile
  router.get("/:profile", (req, res) => {
    db.query(
      `
      SELECT *
      FROM users
      WHERE id = $1;
      `,
      [req.params.profile]
    )
      .then((data) => {
        const users = data.rows[0];
        templateVars = {
          user: users.id,
          name: users.name,
          email: users.email,
          password: users.password,
        };
        res.render("profile", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Register New User
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
        const users = data.rows[0];
        req.session.user_id = users.id;
        res.send("added user!");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
