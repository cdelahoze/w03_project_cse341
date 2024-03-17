const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const errorMiddleware = require('./middleware/errors')
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT || 8080;
const app = express();

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', require('./routes'));



app.use(errorMiddleware)

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

mongodb.initDb((err) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(port);
      console.log(`Connected to Database and listening on ${port}`);
    }
  });

  mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error(error));

