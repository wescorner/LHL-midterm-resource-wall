/*
 * All routes for tags are defined here
 * Since this file is loaded in server.js into api/tags,
 *   these routes are mounted onto /tags
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/:id", (req, res) => {
    db.query(
      `
      INSERT INTO tags (tag, user_id, resource_id)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [req.body.tag, 1, req.params.id]
    )
      .then((data) => {
        const tags = data.rows;
        console.log(tags);
        res.send("added tag!");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};