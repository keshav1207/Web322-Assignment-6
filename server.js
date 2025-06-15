/*********************************************************************************
 *  WEB322 – Assignment 3
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Keshav Callychurn Student ID: 108568247 Date: 14/06/2025
 * Published URL:
 ********************************************************************************/
const express = require("express");
const projectData = require("./modules/projects");
const path = require("path");
const app = express();

const PORT = 3000;

app.use(express.static(__dirname + "/public"));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views/about.html"));
});

app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector;

  if (sector) {
    projectData
      .getProjectsBySector(sector)
      .then((projects) => res.json(projects))
      .catch((err) => res.status(404).send(err));
  } else {
    projectData
      .getAllProjects()
      .then((projects) => res.json(projects))
      .catch((err) => res.status(404).send(err));
  }
});

app.get("/solutions/projects/:id", (req, res) => {
  const projectId = parseInt(req.params.id);

  projectData
    .getProjectById(projectId)
    .then((project) => res.json(project))
    .catch((err) => res.status(404).send(err));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views/404.html"));
});

projectData
  .initialize()
  .then(() => {
    console.log("Project data initialized successfully.");
    app.listen(PORT, () => console.log("Server is running on port " + PORT));
  })
  .catch((error) => {
    console.log("Failed to initialize project data:", error);
  });
