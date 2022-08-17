"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var app = (0, express_1["default"])();
var port = 6969;
// should register a user; given its username and password
app.post("/register", function (req, res) {
    // should store username as key in a map
    // Map of users = (key, value) => (username, hashedPassword)
    // should store plaintext password as hashed value in a map
    res.send("Registered a user");
});
// should login a user; given its username and passwordAttempt
app.post("/login", function (req, res) {
    // should retrieve user from a map using username
    // should compare hashed passwordAttempt and actual password
    // if the same password, login in successful, otherwise fail
    res.send("Succesful login");
});
app.listen(port, function () {
    console.log("App is listening to port: " + port);
});
