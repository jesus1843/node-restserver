const express = require('express');

let Producto = require('../models/product');
const { tokenVerification, adminRoleVerification } = require('../middlewares/authentication');

let app = express();


//==============================================
//  Obtener productos
//==============================================
app.get('/producto', tokenVerification, (req, res) => {
  // trae todos los productos
  // populate: usuario categoria
  // paginado
  let limD = req.query.limD || 0;

  Producto.find({ available: true }).
  skip(limD).
  limit(5).
  populate('user', 'name email').
  populate('category', 'description').
  exec((err, productosDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      productos: productosDB
    });
  });

});


//==============================================
//  Obtener producto por ID
//==============================================
app.get('/producto/:id', tokenVerification, (req, res) => {
  // populate: usuario categoria
  let id = req.params.id;

  Producto.findById(id).
  populate('user', 'name email').
  populate('category', 'name').
  exec((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "ID doesn't exist"
        }
      });
    }

    res.json({
      ok: true,
      productos: productoDB
    });
  });
});


//==============================================
//  Buscar productos
//==============================================
app.get('/producto/search/:term', tokenVerification, (req, res) => {
  let term = req.params.term;
  let regex = new RegExp(term, 'i');

  Producto.find({ name: regex }).
  populate('category', 'name').
  exec((err, productsDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      productos: productsDB
    });
  });
});


//==============================================
//  Crear nuevo producto
//==============================================
app.post('/producto', tokenVerification, (req, res) => {
  // grabar el usuario
  // grabar la categoria del listado
  let body = req.body;

  let product = new Producto({
    user: req.user._id,
    name: body.name,
    priceUni: body.priceUni,
    description: body.description,
    available: body.available,
    category: body.category,
  });

  product.save((err, productDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.status(201).json({
      ok: true,
      producto: productDB
    });
  });
});


//==============================================
//  Actualizar producto
//==============================================
app.put('/producto/:id', tokenVerification, (req, res) => {
  // grabar el usuario
  // grabar la categoria del listado
  let id = req.params.id;
  let body = req.body;

  Producto.findById(id, (err, productDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "ID doesn't exist"
        }
      });
    }

    productDB.name = body.name;
    productDB.priceUni = body.priceUni;
    productDB.category = body.category;
    productDB.available = body.available;
    productDB.description = body.description;

    productDB.save((err, productSaved) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        producto: productSaved
      });
    });

  });
});


//==============================================
//  Borrar producto
//==============================================
app.delete('/producto/:id', tokenVerification, (req, res) => {
  // grabar el usuario
  // grabar la categoria del listado
  let id = req.params.id;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "ID doesn't exists"
        }
      });
    }

    productoDB.available = false;

    productoDB.save((err, productoErased) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        producto: productoErased,
        message: "Product erased"
      });
    });
  });
});

module.exports = app;
