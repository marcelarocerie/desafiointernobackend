import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// 🗝 Domínios liberados para chamar sua API
const allowedOrigins = [
  'https://desafiointernofrontend.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    return allowedOrigins.includes(origin)
      ? callback(null, true)
      : callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());

app.get('/api/ping', (req, res) => res.json({ pong: true }));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});
