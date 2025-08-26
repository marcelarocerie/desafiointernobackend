import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Domínios permitidos (fixos)
const allowedExact = [
  'https://desafiointernofrontend.vercel.app', // produção
  'http://localhost:5173',                     // dev local (Vite)
];

// Permite qualquer PREVIEW da Vercel para este projeto
// Ex.: https://desafiointernofrontend-5lasw1ngn-marcelas-projects-6aa7d53e.vercel.app
const allowPreview = (origin) =>
  /^https:\/\/desafiointernofrontend-[a-z0-9-]+\.vercel\.app$/.test(origin || '');

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // curl/Postman/health checks
    if (allowedExact.includes(origin) || allowPreview(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());

app.get('/api/ping', (req, res) => res.json({ pong: true }));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});
