import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  descricao: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  imagem: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  categoria: {
    type: String,
    enum: ['produto', 'servico', 'assinatura'],
    default: 'produto'
  },
  estoque: {
    type: Number,
    default: 10
  },
  lojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Opcional por enquanto para simplificar
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
