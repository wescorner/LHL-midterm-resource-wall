/*
 * All routes for Resources are defined here
 * Since this file is loaded in server.js into api/resources,
 *   these routes are mounted onto /resources
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(
      `
      SELECT * FROM resources;      `
    )
      .then((data) => {
        const resources = data.rows;
        res.json(resources);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    db.query(
      `
      INSERT INTO resources (title, description, url, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [req.body.title, req.body.description, req.body.url, req.body.user_id]
    )
      .then((data) => {
        const resources = data.rows;
        console.log(resources);
        res.send("added resource!");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/:id", (req, res) => {
    db.query(
      `
      SELECT resources.* FROM resources
      JOIN likes ON resources.id = resource_id
      WHERE resources.user_id = $1
      OR resources.id IN (
        SELECT resource_id FROM likes WHERE user_id = $1
      )
      GROUP BY resources.id;
      `,
      [req.params.id]
    )
      .then((data) => {
        const resources = data.rows;
        res.json(resources);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
