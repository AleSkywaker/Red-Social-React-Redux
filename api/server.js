"use strict";

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/post");

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//DB Config
const db = require("./config/keys").mongoURI;
//Connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log(`MongoDB conectado`))
  .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());


//Passport Config
require('./config/passport')(passport);

//Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5600;

app.get("/", (req, res) => {
  res.status(200).send({ message: "Hola desde la api de REACT" });
});

app.listen(port, () => {
  console.log(`Escuchando en puerto ${port}`);
});
