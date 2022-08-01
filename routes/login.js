/*
 * All routes for login are defined here
 * Since this file is loaded in server.js into api/login,
 *   these routes are mounted onto /login
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (req.session.user_id) {
      return res.send("already logged in");
    }
    db.query(
      `
      SELECT *
      FROM users
      WHERE email = $1;
      `,
      [email]
    )
      .then((data) => {
        const user = data.rows[0];
        console.log(user);
        if (!user) {
          res.send("user does not exist");
        }
        if (password === user.password) {
          req.session.user_id = user.id;
          res.send({ user: req.session.user_id });
        } else {
          res.send("incorrect password");
        }
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  });
  return router;
};
