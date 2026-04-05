import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para verificar JWT e anexar usuário ao req
export const protectRoute = async (req, res, next) => {
  let token;

  // Verificar se o token está no header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Se não houver token, continuar sem usuário (permite carrinhos anônimos)
  if (!token) {
    return next();
  }

  try {
    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_iniciloja');
    
    // Buscar o usuário no banco de dados
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error.message);
    // Se o token for inválido, continuar sem usuário
    next();
  }
};
