import express, { Request, Response } from "express";
import next from 'next';

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express()
  server.get('*', (req, res) => {
    return handle(req, res)
  })
  server.listen(5000, () => {
    console.log("Server is Ready.");
  });
}).catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})