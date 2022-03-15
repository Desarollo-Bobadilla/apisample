// Get Dependencies

var express = require("express");
const Joi = require("joi");

const Movie = require("../models/movie");
const User = require("../models/user");

// Set model to access router and security

var router = express.Router();

var HandlerGenerator = require("../handlegenerator.js");
var middleware = require("../middleware.js");

HandlerGenerator = new HandlerGenerator();

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
});

// -------------------------------------------------------------- MOVIES

// THis should be in controllers, but we will let Mongo be there, and here an SQLite configuration.

// GET ALL

router.get("/movies", middleware.checkToken, function (req, res, next) {

  Movie.findAll().then((movies) => {
    res.send(movies);
  });

});

// GET BY ID

router.get("/movies/:id", middleware.checkToken, function (req, res, next) {
  Movie.findByPk(req.params.id).then((movie) => {

    if (movie === null) {
      res.status(404).send("Pelicula no existente");
    }

    res.send(movie);
  });

});

// CREATED A MOVIE

router.post("/movies", middleware.checkToken, function (req, res, next) {
  
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(404).send(error);
  }

  Movie.create({name: req.body.name}).then((result) => {
    res.send(result);
  });

});

// UPDATE A MOVIE

router.put("/movies/:id", middleware.checkToken, function (req, res, next) {

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(404).send(error);
  }

  Movie.update(req.body, { where: { id: req.params.id } }).then((movie) => {

    if (movie.matchedCount === 0) {
      return res.status(404).send("Pelicula inexistente");
    }

    res.send("Pelicula Actualizada");
  });

});

// DELETE MOVIE

router.delete("/movies/:id", middleware.checkToken, function (req, res, next) {

  Movie.destroy({ where: { id: req.params.id } }).then((result) => {

    if (result === 0) {
      res.status(404).send("Pelicula inexistente");
    } else {
      res.status(204).send();
    }

  });

});

// -------------------------------------------------------------- USER

// THis should be in controllers, but we will let Mongo be there, and here an SQLite configuration.

// GET ALL

router.get("/users", middleware.checkToken, function (req, res, next) {

  User.findAll().then((users) => {
    res.send(users);
  });

});

// GET BY ID

router.get("/users/:id", middleware.checkToken, function (req, res, next) {

  User.findByPk(req.params.id).then((user) => {

    if (user === null) {
      res.status(404).send("Usuario Inexistente");
    }

    res.send(user);

  });

});

// CREATED A USER

router.post("/users", middleware.checkToken, function (req, res, next) {

  User.create({username: req.body.username, password: btoa(req.body.password), role: req.body.role }).then((result) => {
    res.send(result);
  });

});

// UPDATE A USER

router.put("/users/:id", middleware.checkToken, function (req, res, next) {

  User.update(req.body, { where: { id: req.params.id } }).then((user) => {

    if (user.matchedCount === 0) {
      return res.status(404).send("User inexistente");
    }

    res.send("Usuario actualizado");
    
  });
});

// DELETE USER

router.delete("/users/:id", middleware.checkToken, function (req, res, next) {

  User.destroy({ where: { id: req.params.id } }).then((result) => {

    if (result === 0) {
      res.status(404).send("Usuario inexistente");
    } else {
      res.status(204).send();
    }

  });

});

// -------------------------------------------------------------- AUTH

router.post("/login", HandlerGenerator.login);
router.get("/", middleware.checkToken, HandlerGenerator.index);

// -------------------------------------------------------------- EXPORT

module.exports = router;