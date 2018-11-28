const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let validatedRoles = {
  values: ['SUPER_ROLE', 'ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol valido'
};

let userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es necesario']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo electrónico es necesario']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es necesario']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: validatedRoles
  },
  state: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  
  return userObject;
}

userSchema.plugin(uniqueValidator, {
  message: '{PATH} ya está registrado'
});

module.exports = mongoose.model('Usuario', userSchema);