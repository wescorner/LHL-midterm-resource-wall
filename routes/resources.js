/*
 * All routes for Resources are defined here
 * Since this file is loaded in server.js into api/resources,
 *   these routes are mounted onto /resources
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //View Resources
  router.get("/", (req, res) => {
    const input = req.query.input;
    queryParams = [];
    queryString = `
      SELECT resources.*, tag
      FROM resources
      LEFT JOIN tags ON resources.id = resource_id
      GROUP BY resources.id, tag
    `;
    if (input) {
      queryParams.push(`%${input}%`);
      queryString += `HAVING tag LIKE $1`;
    }
    queryString += `ORDER BY resources.id;`;
    db.query(queryString, queryParams)
      .then((data) => {
        const resources = data.rows;
        templateVars = {
          ids: [],
          titles: [],
          descriptions: [],
          urls: [],
          tags: {},
          user: req.session.user_id,
        };
        resources.forEach((i) => {
          templateVars.tags[i.id]
            ? templateVars.tags[i.id].push(i.tag)
            : (templateVars.tags[i.id] = [i.tag]);
          if (templateVars.ids.includes(i.id)) return;
          templateVars.ids.push(i.id);
          templateVars.titles.push(i.title);
          templateVars.descriptions.push(i.description);
          templateVars.urls.push(i.url);
        });
        res.render("index", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Add Resource
  router.post("/", (req, res) => {
    if (!req.session.user_id) {
      return res.send("only logged in users may create a resource");
    }
    db.query(
      `
      INSERT INTO resources (title, description, url, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [req.body.title, req.body.description, req.body.url, req.session.user_id]
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

  //My Resources
  router.get("/:id", (req, res) => {
    db.query(
      `
      SELECT resources.*, tag FROM resources
      LEFT JOIN likes ON resources.id = likes.resource_id
      JOIN tags ON resources.id = tags.resource_id
      WHERE resources.user_id = $1
      OR resources.id IN (
        SELECT resource_id FROM likes WHERE likes.user_id = $1
      )
      GROUP BY resources.id, tag;
      `,
      [req.params.id]
    )
      .then((data) => {
        const resources = data.rows;
        console.log(resources);
        templateVars = {
          ids: [],
          titles: [],
          descriptions: [],
          urls: [],
          tags: {},
          user: req.session.user_id,
        };
        resources.forEach((i) => {
          templateVars.tags[i.id]
            ? templateVars.tags[i.id].push(i.tag)
            : (templateVars.tags[i.id] = [i.tag]);
          if (templateVars.ids.includes(i.id)) return;
          templateVars.ids.push(i.id);
          templateVars.titles.push(i.title);
          templateVars.descriptions.push(i.description);
          templateVars.urls.push(i.url);
        });
        res.render("myresources", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
