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
    queryParams = [req.session.user_id];
    queryString = `
      SELECT resources.*, tag, rating
      FROM resources
      LEFT JOIN tags ON resources.id = tags.resource_id
      FULL OUTER JOIN (SELECT * FROM ratings WHERE user_id = $1) AS ratings
      ON resources.id = ratings.resource_id
      GROUP BY resources.id, tag, rating
    `;
    if (input) {
      queryParams.push(`%${input}%`);
      queryString += `HAVING tag LIKE $2`;
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
          ratings: [],
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
          templateVars.ratings.push(i.rating);
        });
        console.log(templateVars);
        res.render("index", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Add Resource
  router.post("/", (req, res) => {
    if (!req.session.user_id) {
      return res.status(400).send("only logged in users may create a resource");
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
    if (req.session.user_id != req.params.id) {
      return res.status(400).send("CAN ONLY VIEW YOUR OWN RESOURCES");
    }
    db.query(
      `
      SELECT resources.*, tag, likes.user_id AS like, rating
      FROM resources
      FULL OUTER JOIN likes ON resources.id = likes.resource_id
      FULL OUTER JOIN tags ON resources.id = tags.resource_id
      FULL OUTER JOIN ratings ON resources.id = ratings.resource_id
      WHERE resources.user_id = $1
      OR resources.id IN (
        SELECT resource_id FROM likes WHERE likes.user_id = $1
      )
      GROUP BY resources.id, tag, likes.user_id, rating;
      `,
      [req.params.id]
    )
      .then((data) => {
        const resources = data.rows;
        console.log(resources);
        templateVars = {
          owned: {
            ids: [],
            titles: [],
            descriptions: [],
            urls: [],
            ratings: [],
            tags: {},
          },
          liked: {
            ids: [],
            titles: [],
            descriptions: [],
            urls: [],
            ratings: [],
            tags: {},
          },
          user: req.session.user_id,
        };
        resources.forEach((i) => {
          console.log("i:", i);
          if (i.user_id === req.session.user_id) {
            templateVars.owned.tags[i.id]
              ? templateVars.owned.tags[i.id].push(i.tag)
              : (templateVars.owned.tags[i.id] = [i.tag]);
            if (templateVars.owned.ids.includes(i.id)) return;
            templateVars.owned.ids.push(i.id);
            templateVars.owned.titles.push(i.title);
            templateVars.owned.descriptions.push(i.description);
            templateVars.owned.urls.push(i.url);
            templateVars.owned.ratings.push(i.rating);
            templateVars.owned.tags[i] = [
              ...new Set(templateVars.owned.tags[i]),
            ];
          } else {
            templateVars.liked.tags[i.id]
              ? templateVars.liked.tags[i.id].push(i.tag)
              : (templateVars.liked.tags[i.id] = [i.tag]);
            if (templateVars.liked.ids.includes(i.id)) return;
            templateVars.liked.ids.push(i.id);
            templateVars.liked.titles.push(i.title);
            templateVars.liked.descriptions.push(i.description);
            templateVars.liked.urls.push(i.url);
            templateVars.liked.ratings.push(i.rating);
            templateVars.liked.tags[i] = [
              ...new Set(templateVars.liked.tags[i]),
            ];
          }
        });
        console.log(templateVars);
        console.log(templateVars.liked.tags);
        res.render("myresources", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Remove Resource
  router.delete("/:id", (req, res) => {
    if (!req.session.user_id) {
      return res.status(400).send("only logged in users may remove a resource");
    }
    if (req.session.user_id != req.params.id) {
      return res.status(400).send("CANNOT REMOVE THAT RESOURCE");
    }
    db.query(
      `
      DELETE FROM resources
      WHERE id = $1
      RETURNING *;
      `,
      [req.params.id]
    )
      .then((data) => {
        const resources = data.rows;
        console.log(resources);
        res.redirect("back");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
