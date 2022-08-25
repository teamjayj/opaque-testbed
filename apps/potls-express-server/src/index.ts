import express, { Request, Response } from "express";
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();
const port = 6969;
const users: Map<string, string> = new Map();

app.use(cors());

app.use(express.urlencoded({ extended: false }))

/*
app.get("/register", (req: Request, res: Response) => {
  res.send(`
    <div class="container">
      <h1>Register</h1>
      <p>Please fill in this form to create an account.</p>
      <hr>
      <form action="/register" method="POST">
          <label for="uname">Username:</label><br>
          <input type="text" placeholder="Enter Username" id="uname" name="uname"><br>
          <label for="pwd">Password:</label><br>
          <input type="password" placeholder="Enter Password" id="pwd" name="pwd"><br><br>
          <input type="submit" value="Submit">
      </form>
      <a href="/login">Login</a>
  </div>
  `)
});

app.get("/login", (req: Request, res: Response) => {
  res.send(`
    <div class="container">
        <h1>Login</h1>
        <p>Please fill in this form to access the system.</p>
        <hr>
        <form action="/login" method="POST">
            <label for="uname">Username:</label><br>
            <input type="text" placeholder="Enter Username" id="uname" name="uname"><br>
            <label for="pwd">Password:</label><br>
            <input type="password" placeholder="Enter Password" id="pwd" name="pwd"><br><br>
            <input type="submit" value="Submit">
        </form>
        <a href="/register">Register</a>
    </div>
  `)
});
*/

app.post("/register", async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.pwd, 10)
    users.set(req.body.uname, hashedPassword)
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  console.log(users)
});

app.post("/login", async (req: Request, res: Response) => {
  const password = String(users.get(req.body.uname))
  
  if (users.has(req.body.uname) == false) {
    return res.status(400).send('Cannot find user')
  } try {
    if (await bcrypt.compare(req.body.pwd, password)) {
        res.send('Success')
    } else {
        res.send('Login Failed')
    }
  } catch {
    res.status(500).send()
  }
});

app.listen(port, () => {
  console.log("App is listening to port: " + port);
});