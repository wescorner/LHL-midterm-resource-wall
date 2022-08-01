/*
 * All routes for Comments are defined here
 * Since this file is loaded in server.js into api/comments,
 *   these routes are mounted onto /comments
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    db.query(
      `
      SELECT comments.comment, users.name
      FROM comments
      JOIN users ON users.id = user_id
      WHERE resource_id = $1;
      `,
      [req.params.id]
    )
      .then((data) => {
        const comments = data.rows;
        console.log(comments);
        const templateVars = {
          comments: [],
          user_names: [],
        };
        comments.forEach((i) => {
          templateVars.comments.push(i.comment);
          templateVars.user_names.push(i.name);
        });
        console.log(templateVars);
        res.send(templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/:id", (req, res) => {
    if (!req.session.user_id) {
      return res.send("only logged in users may create a comment");
    }
    db.query(
      `
      INSERT INTO comments (comment, user_id, resource_id)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [req.body.comment, 1, req.params.id]
    )
      .then((data) => {
        const comments = data.rows;
        console.log(comments);
        res.send("added comment!");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
