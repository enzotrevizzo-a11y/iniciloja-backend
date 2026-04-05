import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  produtoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  preco: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Permitir carrinhos anônimos por enquanto
  },
  sessaoId: {
    type: String, // Para usuários não logados
    required: false
  },
  itens: [cartItemSchema],
  total: {
    type: Number,
    default: 0
  },
  atualizadoEm: {
    type: Date,
    default: Date.now
  }
});

// Middleware para calcular o total antes de salvar
cartSchema.pre('save', function(next) {
  this.total = this.itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  this.atualizadoEm = Date.now();
  next();
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
