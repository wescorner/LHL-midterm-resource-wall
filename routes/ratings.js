/*
 * All routes for ratings are defined here
 * Since this file is loaded in server.js into api/ratings,
 *   these routes are mounted onto /ratings
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/:id", (req, res) => {
    db.query(
      `
      INSERT INTO ratings (rating, user_id, resource_id)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [req.body.rating, req.session.user_id, req.params.id]
    )
      .then((data) => {
        const ratings = data.rows;
        console.log(ratings);
        res.send(`rated ${req.body.rating} stars!`);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
