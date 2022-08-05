/*
 * All routes for Comments are defined here
 * Since this file is loaded in server.js into api/comments,
 *   these routes are mounted onto /comments
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //Get Resource's Comments
  router.get("/:id", (req, res) => {
    db.query(
      `
      SELECT comments.id, comments.comment, users.name
      FROM comments
      JOIN users ON users.id = user_id
      WHERE resource_id = $1;
      `,
      [req.params.id]
    )
      .then((data) => {
        const comments = data.rows;
        const templateVars = {
          ids: [],
          comments: [],
          user_names: [],
        };
        comments.forEach((i) => {
          templateVars.ids.push(i.id);
          templateVars.comments.push(i.comment);
          templateVars.user_names.push(i.name);
        });
        res.send(templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Add Comment
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
      [req.body.comment, req.session.user_id, req.params.id]
    )
      .then((data) => {
        const comments = data.rows;
        res.send(comments[0]);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Delete Comment
  router.delete("/:id", (req, res) => {
    if (!req.session.user_id) {
      return res.send("only logged in users may delete a comment");
    }
    db.query(
      `
      DELETE FROM comments
      WHERE id = $1 AND user_id = $2
      RETURNING *;
      `,
      [req.params.id, req.session.user_id]
    )
      .then((data) => {
        const comments = data.rows;
        if (comments.length === 0) {
          return res.send("comment does not exist or you are not the creator");
        }
        console.log(comments);
        res.send("removed comment!");
      })
      .catch((err) => {
        res.status(400).send("you must be the owner to delete a comment");
      });
  });
  return router;
};
