const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).send("Welcome to Express Server!");
});

app.get("/about", (request, response) => {
  response.status(200).json({
    name: "PALLE HARAVIND REDDY",
    section: "313 AI DE 2B"
  });
});

app.get("/time", (request, response) => {
  response.status(200).json({
    currentTime: new Date().toISOString()
  });
});

app.use((request, response) => {
  response.status(404).json({
    message: "Route Not Found"
  });
});

app.listen(3000, () => {
  console.log("Express Server Running at http://localhost:3000/");
});

module.exports = app;
