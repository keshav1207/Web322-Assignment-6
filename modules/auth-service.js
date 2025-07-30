// modules/auth-service.js

const mongoose = require("mongoose");
require("dotenv").config();

let Schema = mongoose.Schema;
let User; // to be defined after db connection

// Schema Definition
const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  email: String,
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String,
    },
  ],
});

// Initialize Function
function initialize() {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(process.env.MONGODB);

    db.on("error", (err) => {
      reject(err);
    });

    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
}

// Register User Function
function registerUser(userData) {
  return new Promise((resolve, reject) => {
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
      return;
    }

    let newUser = new User({
      userName: userData.userName,
      password: userData.password,
      email: userData.email,
      loginHistory: [],
    });

    newUser
      .save()
      .then(() => resolve())
      .catch((err) => {
        if (err.code === 11000) {
          reject("User Name already taken");
        } else {
          reject("There was an error creating the user: " + err);
        }
      });
  });
}

// Check User Function
function checkUser(userData) {
  return new Promise((resolve, reject) => {
    User.find({ userName: userData.userName })
      .then((users) => {
        if (users.length === 0) {
          reject(`Unable to find user: ${userData.userName}`);
          return;
        }

        if (users[0].password !== userData.password) {
          reject(`Incorrect Password for user: ${userData.userName}`);
          return;
        }

        // Update login history
        if (users[0].loginHistory.length === 8) {
          users[0].loginHistory.pop();
        }

        users[0].loginHistory.unshift({
          dateTime: new Date().toString(),
          userAgent: userData.userAgent,
        });

        User.updateOne(
          { userName: users[0].userName },
          { $set: { loginHistory: users[0].loginHistory } }
        )
          .then(() => resolve(users[0]))
          .catch((err) => {
            reject("There was an error verifying the user: " + err);
          });
      })
      .catch((err) => {
        reject(`Unable to find user: ${userData.userName}`);
      });
  });
}

module.exports = { initialize, registerUser, checkUser };
