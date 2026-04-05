import Product from '../models/Product.js';

// @desc    Obter todos os produtos
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
};

// @desc    Obter produto por ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
  }
};

// @desc    Criar um novo produto (apenas para teste)
// @route   POST /api/products
export const createProduct = async (req, res) => {
  const { nome, descricao, preco, imagem, categoria, estoque } = req.body;

  try {
    const product = await Product.create({
      nome,
      descricao,
      preco,
      imagem,
      categoria,
      estoque
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar produto', error: error.message });
  }
};
