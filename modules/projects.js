/*********************************************************************************
 *  WEB322 – Assignment 4
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Keshav Callychurn Student ID: 108568247 Date: 5/07/2025
 * Published URL: https://web322-assignment-4-rho.vercel.app/
 ********************************************************************************/

const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

function initialize() {
  return new Promise((resolve, reject) => {
    try {
      projectData.forEach((item) => {
        const sectorId = item.sector_id;

        const sector = sectorData.find((sector) => sector.id === sectorId);
        const sectorName = sector.sector_name;

        item["sector"] = sectorName;
        projects.push(item);
      });

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function getAllProjects() {
  return new Promise((resolve, reject) => {
    try {
      resolve(projects);
    } catch (error) {
      reject(error);
    }
  });
}

function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    try {
      const results = projects.find((project) => project.id == projectId);
      resolve(results);
    } catch (error) {
      console.log("Unable to find requested project");
      reject(error);
    }
  });
}

function getProjectsBySector(sect) {
  return new Promise((resolve, reject) => {
    try {
      const targetSect = sect.toLowerCase();
      const results = projects.filter((project) => {
        const projectSector = project.sector.toLowerCase();
        return projectSector.includes(targetSect);
      });

      resolve(results);
    } catch (error) {
      console.log("Unable to find requested projects");
      reject(error);
    }
  });
}

module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
};
