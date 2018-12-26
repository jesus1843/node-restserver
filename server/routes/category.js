const express = require('express');

let Categoria = require('../models/category');
const { tokenVerification, adminRoleVerification } = require('../middlewares/authentication');

let app = express();

//========================================
//  Mostrar todas las categorías
//========================================
app.get('/categoria', tokenVerification, (req, res) => {
  Categoria.find({}).
  sort('description').
  populate('user', 'name email').
  exec((err, categorias) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      categorias
    });
  });
});

//========================================
//  Mostrar una categoría por ID
//========================================
app.get('/categoria/:id', tokenVerification, (req, res) => {
  let id = req.params.id;
  
  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Wrong ID'
        }
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

//========================================
//  Crear nueva categoría
//========================================
app.post('/categoria', tokenVerification, (req, res) => {
  // Regresa la nueva categoría
  // req.usuario._id
  let body = req.body;

  let categoria = new Categoria({
    description: body.descripcion,
    user: req.user._id
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

//========================================
//  Actualizar una categoría
//========================================
app.put('/categoria/:id', tokenVerification, (req, res) => {
  // Regresa la nueva categoría
  // req.usuario._id
  let id = req.params.id;
  let body = req.body;

  let descCategoria = {
    description: body.descripcion
  };

  Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
  
});

//========================================
//  Eliminar una categoría
//========================================
app.delete('/categoria/:id', [tokenVerification, adminRoleVerification], (req, res) => {
  // Sólo un administrador puede borrar categorías
  // Categoria.findByIdAndRemove
  let id = req.params.id;

  Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID no existe'
        }
      });
    }

    res.json({
      ok: true,
      message: 'Categoría borrada'
    });
  });
});

module.exports = app;
