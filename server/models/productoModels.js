var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombreProducto: { type: String, required: [true, 'El nombre es necesario'] },
    precioUnitario: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descripcionProducto: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoriaProductoID: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Clientes' }
});


module.exports = mongoose.model('Producto', productoSchema);