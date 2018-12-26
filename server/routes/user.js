const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/user');
const { tokenVerification, adminRoleVerification } = require('../middlewares/authentication');

const app = express();

app.get('/usuario', tokenVerification, (req, res) => {
  if (req.query.lim && req.query.from) {
    let from = Number(req.query.from || 0);
    let lim = Number(req.query.lim || 5);

    Usuario.find({ state: true }, 'name email role state google')
      .skip(from)
      .limit(lim)
      .exec((err, users) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err
          });
        }

        Usuario.countDocuments({ state: true }, (err, quantity) => { // count() es viejo
          res.json({
            ok: true,
            users,
            totalUsers: quantity
          });
        });
      });
  } else {
    Usuario.find({ state: true }, 'name email role state google')
      .exec((err, users) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err
          });
        }

        Usuario.countDocuments({ state: true }, (err, quantity) => { // count() es viejo
          res.json({
            ok: true,
            users,
            totalUsers: quantity
          });
        });
      });
  }
});

app.post('/usuario', [tokenVerification, adminRoleVerification], function (req, res) {
  let body = req.body;

  let user = new Usuario({
    name: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  user.save((err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    // userDB.password = null;

    res.json({
      ok: true,
      user: userDB
    });
  });

});

app.put('/usuario/:id', [tokenVerification, adminRoleVerification], function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ['name','email','img','role','state']);

  delete body.google;
  delete body.password;

  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: userDB
    });

  });

  // res.json({
  //   "ID introducido es":id
  // });
});

app.delete('/usuario/:id', [tokenVerification, adminRoleVerification], function (req, res) {
  let id = req.params.id;
  let changeState = {
    state: false
  }

  // Usuario.findByIdAndRemove(id, (err, userDeleted) => {
  Usuario.findByIdAndUpdate(id, changeState, { new: true }, (err, userDeleted) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!userDeleted) {
      return res.status(400).json({
        ok: false,
        err: {
          message: `User with _id -> '${id}' did not find`
        }
      });
    }

    res.json({
      ok: true,
      user: userDeleted
    });
  });
});

module.exports = app;