/*
 * All routes for tags are defined here
 * Since this file is loaded in server.js into api/tags,
 *   these routes are mounted onto /tags
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
const express = require("express");
const router = express.Router();

//Add Tag
module.exports = (db) => {
  router.post("/:id", (req, res) => {
    if (!req.session.user_id) {
      return res.status(400).send("only logged in users may add a tag");
    }
    db.query(
      `
      INSERT INTO tags (tag, user_id, resource_id)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [req.body.tag, req.session.user_id, req.params.id]
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

  //Remove Tag
  router.delete("/:id", (req, res) => {
    db.query(
      `
      DELETE FROM tags
      WHERE user_id = $1 AND resource_id = $2
      RETURNING *;
      `,
      [req.session.user_id, req.params.id]
    )
      .then((data) => {
        const tags = data.rows;
        console.log(tags);
        res.send("removed tag!");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
