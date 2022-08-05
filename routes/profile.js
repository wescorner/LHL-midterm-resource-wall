/*
 * All routes for editprofile are defined here
 * Since this file is loaded in server.js into api/editprofile,
 *   these routes are mounted onto /editprofile
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

module.exports = (db) => {
  //Get Profile
  router.get("/:id", (req, res) => {
    db.query(
      `
      SELECT * FROM users WHERE id = $1;
      `,
      [req.params.id]
    )
      .then((data) => {
        const profile = data.rows[0];
        res.render("profile");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Update Profile
  router.post("/:id", (req, res) => {
    queryParams = [req.session.user_id];
    queryString = `
      UPDATE users
      SET id = $1
    `;

    if (req.body.name) {
      queryParams.push(req.body.name);
      queryString += `, name = $${queryParams.length}`;
    }
    if (req.body.email) {
      queryParams.push(req.body.email);
      queryString += `, email = $${queryParams.length}`;
    }

    if (req.body.password) {
      queryParams.push(bcrypt.hashSync(req.body.password, 10));
      queryString += `, password = $${queryParams.length}`;
    }

    queryString += `
      WHERE id = $1
      RETURNING *;
    `;

    db.query(queryString, queryParams)
      .then((data) => {
        const profile = data.rows[0];
        const templateVars = {
          user: profile.id,
          name: profile.name,
          email: profile.email,
          password: profile.password,
        };
        res.render("profile", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
