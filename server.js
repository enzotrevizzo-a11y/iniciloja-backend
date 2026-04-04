import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// Configurações de CORS - Permitindo apenas o frontend solicitado
const corsOptions = {
  origin: 'https://iniciloja.netlify.app',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Rota de teste obrigatória
app.get('/', (req, res) => {
  res.send('API Iniciloja funcionando');
});

// Rotas da API
app.use('/api/auth', authRoutes);

// Conexão com MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("Conectado ao MongoDB"))
    .catch(err => console.error("Erro ao conectar ao MongoDB:", err));
} else {
  console.warn("Aviso: MONGO_URI não definida no .env");
}

// Porta dinâmica para Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
