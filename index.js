import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { errorHandler, logErrors } from './middlewares/error.handler.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://fraganciasuy-backend.onrender.com',
      'https://fraganciasuy-frontend.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
apiRouter(app);

app.use(logErrors);
app.use(errorHandler);

const startServer = async () => {
  try {
    app.listen(port, (req, res) => {
      console.log(`Escuchando el puerto ${port}`);
    });
  } catch (error) {
    console.error('Error al conectar o sincronizar la base de datos', error);
  }
};

startServer();
export default app;
