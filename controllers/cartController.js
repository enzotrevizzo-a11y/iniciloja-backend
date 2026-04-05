import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Obter o carrinho do usuário ou sessão
// @route   GET /api/cart
export const getCart = async (req, res) => {
  const { sessaoId } = req.query;
  const usuarioId = req.user ? req.user._id : null;

  try {
    let query = {};
    if (usuarioId) {
      query = { usuarioId };
    } else if (sessaoId) {
      query = { sessaoId };
    } else {
      return res.status(400).json({ message: 'Identificação necessária para o carrinho' });
    }

    let cart = await Cart.findOne(query).populate('itens.produtoId');
    
    if (!cart) {
      cart = await Cart.create({
        usuarioId,
        sessaoId,
        itens: [],
        total: 0
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar carrinho', error: error.message });
  }
};

// @desc    Adicionar item ao carrinho
// @route   POST /api/cart/add
export const addToCart = async (req, res) => {
  const { produtoId, quantidade, sessaoId } = req.body;
  const usuarioId = req.user ? req.user._id : null;

  try {
    const produto = await Product.findById(produtoId);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    let query = usuarioId ? { usuarioId } : { sessaoId };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({
        usuarioId,
        sessaoId,
        itens: [],
        total: 0
      });
    }

    // Verificar se o produto já está no carrinho
    const itemExistente = cart.itens.find(item => item.produtoId.toString() === produtoId);

    if (itemExistente) {
      itemExistente.quantidade += (quantidade || 1);
    } else {
      cart.itens.push({
        produtoId,
        quantidade: quantidade || 1,
        preco: produto.preco
      });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('itens.produtoId');
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar ao carrinho', error: error.message });
  }
};

// @desc    Remover item do carrinho
// @route   DELETE /api/cart/remove/:produtoId
export const removeFromCart = async (req, res) => {
  const { produtoId } = req.params;
  const { sessaoId } = req.query;
  const usuarioId = req.user ? req.user._id : null;

  try {
    let query = usuarioId ? { usuarioId } : { sessaoId };
    let cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado' });
    }

    cart.itens = cart.itens.filter(item => item.produtoId.toString() !== produtoId);
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id).populate('itens.produtoId');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover do carrinho', error: error.message });
  }
};
