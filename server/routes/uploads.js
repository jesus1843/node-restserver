const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', (req, res) => {
  let type = req.params.type;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No files were selected.'
      }
    });
  }

  // Validar tipo
  let validTypes = ['products', 'users'];

  if (validTypes.indexOf(type) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `The allowd types are => '${validTypes.join(', ')}'`
      }
    });
  }

  let file2upload = req.files.file;

  let nameFile = file2upload.name.split('.');
  let extensionFile = nameFile[nameFile.length - 1];

  // Allowed extensions
  let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

  if (validExtensions.indexOf(extensionFile) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Valid extensions are => '${validExtensions.join(', ')}'`,
        extension: `.${extensionFile} files no valid`
      }
    });
  }

  // Change name of file
  let newNameFile = `${id}_${1000*(new Date().getSeconds()) + new Date().getMilliseconds()}.${extensionFile}`;

  file2upload.mv(`./uploads/${type}/${newNameFile}`, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    // Here I know the image is in the folder
    if (type === 'users') {
      userImage(id, res, newNameFile);
    } else {
      productImage(id, res, newNameFile);
    }
  });
});

userImage = (id, res, nameFile) => {
  User.findById(id, (err, userDB) => {
    if (err) {
      eraseFile(nameFile, 'users');
      return res.status(500).json( {
        ok: false,
        err
      });
    }

    if (!userDB) {
      eraseFile(nameFile, 'users');
      return res.status(400).json({
        ok: false,
        err: {
          message: "The user doesn't exist"
        }
      });
    }

    eraseFile(userDB.img, 'users');
    userDB.img = nameFile;

    userDB.save((err, userSaved) => {
      res.json({
        ok: true,
        user: userSaved,
        img: nameFile
      });
    });
  });
}

productImage = (id, res, nameFile) => {
  Product.findById(id, (err, productDB) => {
    if (err) {
      eraseFile(nameFile, 'products');
      return res.status(500).json( {
        ok: false,
        err
      });
    }

    if (!productDB) {
      eraseFile(nameFile, 'products');
      return res.status(400).json({
        ok: false,
        err: {
          message: "The product doesn't exist"
        }
      });
    }

    eraseFile(productDB.img, 'products');
    productDB.img = nameFile;

    productDB.save((err, productSaved) => {
      res.json({
        ok: true,
        user: productSaved,
        img: nameFile
      });
    });
  });
}

eraseFile = (imageName, typeFile) => {
  let pathImage = path.resolve(__dirname, `../../uploads/${typeFile}/${imageName}`);
  if (fs.existsSync(pathImage)) {
    fs.unlinkSync(pathImage);
  }
}

module.exports = app;
