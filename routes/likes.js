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
        res.send("added comment!");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
