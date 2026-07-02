import { config } from '../env-config/config.js';
import jwt from 'jsonwebtoken';

function validateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];
  if (!accessToken) {
    return res
      .status(401)
      .json({ message: 'Acceso denegación: Token no provisto' });
  }
  jwt.verify(accessToken, config.jwtSecret, (err, decodedPayload) => {
    if (err) {
      return res
        .status(401)
        .json({ message: 'Acceso denegado: Token inválido o expirado' });
    }
    req.user = decodedPayload;
    return next();
  });
}

export { validateToken };
