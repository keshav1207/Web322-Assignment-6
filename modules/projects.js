/*********************************************************************************
 *  WEB322 – Assignment 5
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Keshav Callychurn Student ID: 108568247 Date: 14/07/2025
 * Published URL:
 ********************************************************************************/

require("dotenv").config();
require("pg");
const { Sequelize, Op } = require("sequelize");

let sequelize = new Sequelize({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
  define: {
    timestamps: false,
  },
});

const Sector = sequelize.define("Sector", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sector_name: Sequelize.STRING,
});

const Project = sequelize.define("Project", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: Sequelize.STRING,
  feature_img_url: Sequelize.STRING,
  summary_short: Sequelize.TEXT,
  intro_short: Sequelize.TEXT,
  impact: Sequelize.TEXT,
  original_source_url: Sequelize.STRING,
  sector_id: Sequelize.INTEGER,
});

Project.belongsTo(Sector, { foreignKey: "sector_id" });

function initialize() {
  return sequelize
    .sync()
    .then(() => Promise.resolve())
    .catch((err) => Promise.reject(err));
}

function getAllProjects() {
  return Project.findAll({
    include: [Sector],
  });
}

function getProjectById(projectId) {
  return Project.findAll({
    where: { id: projectId },
    include: [Sector],
  }).then((projects) => {
    if (projects.length > 0) {
      return projects[0];
    } else {
      return Promise.reject("Unable to find requested project");
    }
  });
}

function getProjectsBySector(sector) {
  return Project.findAll({
    include: [Sector],
    where: {
      "$Sector.sector_name$": {
        [Op.iLike]: `%${sector}%`,
      },
    },
  }).then((projects) => {
    if (projects.length > 0) {
      return projects;
    } else {
      return Promise.reject("Unable to find requested projects");
    }
  });
}

module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
};
