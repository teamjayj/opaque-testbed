import express, { Request, Response } from "express";

const app = express();
const port = 6969;

// Map of users = (key, value) = (username, hashedPassword)
const users: Map<string, string> = new Map();

// should register a user; given its username and password
app.post("/register", (req: Request, res: Response) => {
  // should store username as key in a map
  // should store plaintext password as hashed value in a map

  // install https://www.npmjs.com/package/bcrypt
  // bcrypt function - hash the password for 10 rounds
  // users.set(username, hashedPassword)

  res.send("Registered a user");
});

// should login a user; given its username and passwordAttempt
app.post("/login", (req: Request, res: Response) => {
  // should retrieve user from a map using username
  // should bcrypt compare hashed passwordAttempt and actual password
  // if the same password, login in successful, otherwise fail
  res.send("Succesful login");
});

app.listen(port, () => {
  console.log("App is listening to port: " + port);
});
