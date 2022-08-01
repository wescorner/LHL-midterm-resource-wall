/*
 * All routes for logout are defined here
 * Since this file is loaded in server.js into api/logout,
 *   these routes are mounted onto /logout
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    res.clearCookie("user_id");
  });
  return router;
};
