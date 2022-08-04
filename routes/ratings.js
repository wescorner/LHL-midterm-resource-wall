/*
 * All routes for ratings are defined here
 * Since this file is loaded in server.js into api/ratings,
 *   these routes are mounted onto /ratings
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //Add rating
  router.post("/:id", (req, res) => {
    if (!req.session.user_id) {
      return res.send("only logged in users may give a rating");
    }
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

  //Remove Rating
  router.delete("/:id", (req, res) => {
    if (!req.session.user_id) {
      return res.send("only logged in users may delete a rating");
    }
    db.query(
      `
      DELETE FROM ratings
      WHERE user_id = $1 AND resource_id = $2
      RETURNING *;
      `,
      [req.session.user_id, req.params.id]
    )
      .then((data) => {
        const ratings = data.rows;
        console.log(ratings);
        res.send(`deleted rating!`);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Average Rating
  router.get("/average/:id", (req, res) => {
    db.query(
      `
      SELECT AVG(rating)
      FROM ratings
      WHERE resource_id = $1;
      `,
      [req.params.id]
    )
      .then((data) => {
        const ratings = data.rows[0];
        res.send(String(Math.round(ratings.avg * 10) / 10));
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
