/*********************************************************************************
 *  WEB322 – Assignment 4
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Keshav Callychurn Student ID: 108568247 Date: 5/07/2025
 * Published URL: https://web322-assignment-4-rho.vercel.app/
 ********************************************************************************/
const express = require("express");
const projectData = require("./modules/projects");
const path = require("path");
const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});

app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector;

  if (sector) {
    projectData
      .getProjectsBySector(sector)
      .then((projects) =>
        res.render("projects", { projects, page: "/solutions/projects" })
      )
      .catch(() =>
        res.status(404).render("404", {
          message: `No projects found for sector: ${sector}`,
          page: "/solutions/projects",
        })
      );
  } else {
    projectData
      .getAllProjects()
      .then((projects) =>
        res.render("projects", { projects, page: "/solutions/projects" })
      )
      .catch(() =>
        res.status(404).render("404", {
          message: "Unable to load projects.",
          page: "/solutions/projects",
        })
      );
  }
});

app.get("/solutions/projects/:id", (req, res) => {
  const projectId = parseInt(req.params.id);

  projectData
    .getProjectById(projectId)
    .then((project) =>
      res.render("project", { project, page: "/solutions/projects" })
    )
    .catch(() =>
      res.status(404).render("404", {
        message: `No project found with ID: ${req.params.id}`,
        page: "/solutions/projects",
      })
    );
});

app.use((req, res) => {
  res.status(404).render("404", {
    message: "Sorry, the page you're looking for doesn't exist.",
    page: "",
  });
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
