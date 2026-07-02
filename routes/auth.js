// En tu archivo routes/auth.js (Backend)
import express from 'express';
import {
  loginUser,
  registerUser,
  getUserProfile,
} from '../service/serviceAuth.js';
import { validateToken } from '../middlewares/validateAuth.js';

const router = express.Router();

router.get('/me', validateToken, async (req, res) => {
  try {
    const user = await getUserProfile(req.user.id);

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const authData = await loginUser(email, password);

    return res.status(200).json(authData);
  } catch (error) {
    console.error('❌ ERROR EN EL LOGIN:', error.message);
    return res.status(500).json({ message: 'Error interno del server' });
  }
});

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const newUser = await registerUser(firstName, lastName, email, password);
    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: newUser,
    });
  } catch (error) {
    if (error.message === 'USER_ALREADY_EXISTS') {
      return res.status(400).json({
        message: 'El correo electrónico ya se encuentra registrado',
      });
    }
    return res.status(500).json({ message: 'Error interno del server' });
  }
});

export default router;
