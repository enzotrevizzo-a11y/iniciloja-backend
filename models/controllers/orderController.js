import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Criar pedido a partir do carrinho
// @route   POST /api/orders/checkout
export const createOrder = async (req, res) => {
  const { sessaoId, endereco, email, telefone } = req.body;
  const usuarioId = req.user ? req.user._id : null;

  try {
    // Validar dados obrigatórios
    if (!email || !telefone || !endereco) {
      return res.status(400).json({ 
        message: 'Email, telefone e endereço são obrigatórios' 
      });
    }

    // Buscar o carrinho
    let query = usuarioId ? { usuarioId } : { sessaoId };
    const cart = await Cart.findOne(query).populate('itens.produtoId');

    if (!cart || cart.itens.length === 0) {
      return res.status(400).json({ message: 'Carrinho vazio' });
    }

    // Validar estoque dos produtos
    for (const item of cart.itens) {
      const produto = await Product.findById(item.produtoId);
      if (!produto) {
        return res.status(400).json({ 
          message: `Produto ${item.produtoId} não encontrado` 
        });
      }
      if (produto.estoque < item.quantidade) {
        return res.status(400).json({ 
          message: `Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque}` 
        });
      }
    }

    // Criar o pedido
    const order = await Order.create({
      usuarioId,
      sessaoId,
      itens: cart.itens.map(item => ({
        produtoId: item.produtoId._id,
        nome: item.produtoId.nome,
        quantidade: item.quantidade,
        preco: item.preco
      })),
      total: cart.total,
      endereco,
      email,
      telefone,
      status: 'pendente'
    });

    // Atualizar estoque dos produtos
    for (const item of cart.itens) {
      await Product.findByIdAndUpdate(
        item.produtoId,
        { $inc: { estoque: -item.quantidade } }
      );
    }

    // Limpar o carrinho
    await Cart.findByIdAndUpdate(cart._id, {
      itens: [],
      total: 0
    });

    res.status(201).json({
      message: 'Pedido criado com sucesso',
      order,
      pixInfo: {
        message: 'Aguardando implementação de pagamento PIX',
        status: 'pendente'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar pedido', 
      error: error.message 
    });
  }
};

// @desc    Obter pedidos do usuário
// @route   GET /api/orders
export const getUserOrders = async (req, res) => {
  const { sessaoId } = req.query;
  const usuarioId = req.user ? req.user._id : null;

  try {
    let query = {};
    if (usuarioId) {
      query = { usuarioId };
    } else if (sessaoId) {
      query = { sessaoId };
    } else {
      return res.status(400).json({ message: 'Identificação necessária' });
    }

    const orders = await Order.find(query)
      .populate('itens.produtoId')
      .sort({ criadoEm: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar pedidos', 
      error: error.message 
    });
  }
};

// @desc    Obter pedido por ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('itens.produtoId')
      .populate('usuarioId', 'nome email');

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar pedido', 
      error: error.message 
    });
  }
};

// @desc    Confirmar pagamento do pedido
// @route   PUT /api/orders/:id/confirm
export const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmado', atualizadoEm: Date.now() },
      { new: true }
    ).populate('itens.produtoId');

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.json({
      message: 'Pedido confirmado com sucesso',
      order
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao confirmar pedido', 
      error: error.message 
    });
  }
};

// @desc    Cancelar pedido
// @route   PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    // Devolver estoque
    for (const item of order.itens) {
      await Product.findByIdAndUpdate(
        item.produtoId,
        { $inc: { estoque: item.quantidade } }
      );
    }

    order.status = 'cancelado';
    order.atualizadoEm = Date.now();
    await order.save();

    res.json({
      message: 'Pedido cancelado com sucesso',
      order
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao cancelar pedido', 
      error: error.message 
    });
  }
};
