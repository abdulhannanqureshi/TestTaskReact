const express = require("express");
const http = require("http");
const app = express();

app.use(express.static(__dirname + "/public"));

const server = http.createServer(app);

const port = process.env.PORT || 8000;

server
  .listen(port)
  .on("listening", () => {
    console.log(`App started on port ${port}.`);
  })
  .on("error", (err) => console.log(err));
