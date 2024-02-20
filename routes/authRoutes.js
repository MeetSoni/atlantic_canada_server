const express = require("express");
const { handleUserSignup,handleUserLogin } = require("../controller/authcontroller");

const app = express.Router();

app.post("/signup",handleUserSignup);

app.post("/login", handleUserLogin);


module.exports = app;