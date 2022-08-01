/*
 * All routes for login are defined here
 * Since this file is loaded in server.js into api/login,
 *   these routes are mounted onto /login
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    if (req.session.user_id) {
      return res.send("already logged in");
    }
    const templateVars = { user: users[req.session.user_id] };
    res.render("index", templateVars);
  });
  return router;
};
