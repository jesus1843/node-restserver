const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: [true, 'Name is necessary'] },
    priceUni: { type: Number, required: [true, 'Unit price is necessary'] },
    description: { type: String, required: false },
    available: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    img: { type: String, required: false }
});

module.exports = mongoose.model('Producto', productSchema);