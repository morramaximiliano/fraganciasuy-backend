import sequelize from '../libs/sequelize.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../env-config/config.js';

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, {
    expiresIn: '1h',
  });
};

const loginUser = async (email, password) => {
  const user = await sequelize.models.User.findOne({ where: { email } });

  if (!user) {
    throw new Error('AUTH_FAILED');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('AUTH_FAILED');
  }

  const token = generateAccessToken(user);

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  };
};

const registerUser = async (firstName, lastName, email, password) => {
  const userExists = await sequelize.models.User.findOne({ where: { email } });
  if (userExists) {
    throw new Error('USER_ALREADY_EXISTS');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await sequelize.models.User.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
  });

  return {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
  };
};

const getUserProfile = async (userId) => {
  const user = await sequelize.models.User.findByPk(userId);

  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
};

export { loginUser, registerUser, getUserProfile };
