const jwt = require('jsonwebtoken');

//===================================
// Verificar TOKEN
//===================================
let tokenVerification = (req, res, next) => {
  let token = req.get('Authorization-Token'); // Authorization

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err
      });
    }

    req.user = decoded.user;
    next();
  });
};

//===================================
// Verifica ADMIN_ROLE
//===================================
let adminRoleVerification = (req, res, next) => {
  let user = req.user;

  if (user.role == 'ADMIN_ROLE') {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: "The user isn't administrator"
      }
    });
  }
};

module.exports = {
  tokenVerification,
  adminRoleVerification
}