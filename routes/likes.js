/*
 * All routes for likes are defined here
 * Since this file is loaded in server.js into api/likes,
 *   these routes are mounted onto /likes
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/:id", (req, res) => {
    if (!req.session.user_id) {
      return res.status(400).send("only logged in users may like a resource");
    }
    db.query(
      `
      INSERT INTO likes (user_id, resource_id)
      VALUES ($1, $2)
      RETURNING *;
      `,
      [req.session.user_id, req.params.id]
    )
      .then((data) => {
        const likes = data.rows;
        console.log(likes);
        res.send("added like!");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:id", (req, res) => {
    if (!req.session.user_id) {
      return res.status(400).send("only logged in users may remove a like");
    }
    db.query(
      `
      DELETE FROM likes
      WHERE user_id = $1 AND resource_id = $2
      RETURNING *;
      `,
      [req.session.user_id, req.params.id]
    )
      .then((data) => {
        const likes = data.rows;
        console.log(likes);
        if (likes.length === 0) {
          return res.send("you haven't liked this post");
        }
        res.send("removed like!");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
