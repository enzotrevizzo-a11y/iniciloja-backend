import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Função para gerar o token JWT
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_iniciloja', {
    expiresIn: '30d'
  });
};

// @desc    Registrar um novo usuário
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Usuário já cadastrado' });
    }

    const user = await User.create({
      nome,
      email,
      senha
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        nome: user.nome,
        email: user.email,
        token: gerarToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Dados de usuário inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// @desc    Autenticar usuário e obter token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.compararSenha(senha))) {
      res.json({
        _id: user._id,
        nome: user.nome,
        email: user.email,
        token: gerarToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};
