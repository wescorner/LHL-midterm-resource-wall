/*
 * All routes for editprofile are defined here
 * Since this file is loaded in server.js into api/editprofile,
 *   these routes are mounted onto /editprofile
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/:id", (req, res) => {
    db.query(
      `
      UPDATE users
      SET name = $1, email = $2, password = $3
      WHERE id = $4
      RETURNING *;
      `,
      [req.body.name, req.body.email, req.body.password, req.params.id]
    )
      .then((data) => {
        const profile = data.rows[0];
        console.log(profile);
        res.send(`updated user ${req.params.id}!`);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
