import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  produtoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  nome: String,
  quantidade: {
    type: Number,
    required: true,
    min: 1
  },
  preco: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  sessaoId: {
    type: String,
    required: false
  },
  itens: [orderItemSchema],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'],
    default: 'pendente'
  },
  pixQrCode: String,
  pixKey: String,
  pixTransactionId: String,
  endereco: {
    rua: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    cep: String
  },
  email: String,
  telefone: String,
  criadoEm: {
    type: Date,
    default: Date.now
  },
  atualizadoEm: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
