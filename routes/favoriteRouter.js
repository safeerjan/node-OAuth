const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');
const Favorites = require('../models/favorite');

const favoritesRouter = express.Router();
favoritesRouter.use(bodyParser.json());

favoritesRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, (req, res, next) => { //done
    Favorites.find({})
      .populate('user')
      .populate(['dishes'])
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //done
    Favorites.findOne({ user: req.user._id }, (err, favorite) => {
      if (err) return next(err);
      if (!favorite) {
        Favorites.create({ user: req.user._id })
          .then((favorite) => {
            for (i = 0; i = req.body.lenght; i++)
              if (favorite.dishes.indexOf(req.body[i]._id))
                favorite.dishes.push(req.body[i])

            favorite.save()
              .then((favorite) => {
                console.log('Favorite Dish Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              })
          }, (err) => next(err))
          .catch((err) => next(err));
      }
      else {
        for (i = 0; i = req.body.lenght; i++)
          if (favorite.dishes.indexOf(req.body[i]._id))
            favorite.dishes.push(req.body[i])

        favorite.save()
          .then((favorite) => {
            console.log('Favorite Dish Created ', favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
          })
          .catch((err) => next(err));
      }
    })
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //done
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plan');
    res.end("Put operation not supported in /Favorites/" + req.params.favoriteDishID);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //done
    Favorites.findOneAndRemove({ user: req.user._id }, (err, resp) => {
      if (err) return next(err);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp)
    })
  });

//------------------------------------------------------------------------------------------
favoritesRouter.route('/:favoriteDishID')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //done
    Favorites.findOne({ user: req.user._id })
      .populate('user')
      .populate(['dishes'])
      .then((favorite) => {
        if (!favorite) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ "exists": false, "favorites": favorite })
        }
        else {
          if (favorite.dishes.indexOf(req.params.favoriteDishID)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ "exists": false, "favorites": favorite });
          }
          else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ "exists": true, "favorites": favorite })
          }
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //done
    Favorites.findOne({ user: req.user._id }, (err, favorite) => {
      if (err) return next(err);
      if (!favorite) {
        Favorites.create({ user: req.user._id })
          .then((favorite) => {
            favorite.dishes.push({ "_id": req.params.favoriteDishID })
            favorite.save()
              .then((favorite) => {
                console.log('Favorite Dish Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              }).catch((err) => next(err));
          }, (err) => next(err))
          .catch((err) => next(err));
      }
      else {
        if (favorite.dishes.indexOf(req.params.favoriteDishID) < 0) {
          favorite.dishes.push({ "_id": req.params.favoriteDishID })
          favorite.save()
            .then((favorite) => {
              console.log('Favorite Dish Created ', favorite);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            }).catch((err) => next(err));
        }
        else {
          res.statusCode = 403;
          res.setHeader('Content-Type', 'text/plain');
          res.json("Dish " + req.params.favoriteDishID + " already exists.");
        }
      }
    })
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //done
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plan');
    res.end("Put operation not supported in /Favorites/ID" + req.params.favoriteDishID);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }, (err, favorite) => {
      if (err) return next(err);
      var index = favorite.dishes.indexOf(req.params.favoriteDishID);
      if (index >= 0) {
        favorite.dishes.splice(index, 1);
        favorite.save()
          .then((favorite) => {
            console.log('Favorite Dish Created ', favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
          }).catch((err) => next(err));
      }
      else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.json("Dish " + req.params.favoriteDishID + " not in your favorite dishes.");
      }
    });
  });


module.exports = favoritesRouter;