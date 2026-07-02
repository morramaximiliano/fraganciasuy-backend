import sequelize from '../libs/sequelize.js';
import { User } from '../db/models/user.model.js';
import bcrypt from 'bcrypt';

const getAllUser = async () => {
  try {
    const users = await sequelize.models.User.findAll();
    return users;
  } catch (error) {
    console.error('Error en getAllUser', error);
    throw error;
  }
};

const getOneUser = async (id) => {
  try {
    const user = await sequelize.models.User.findByPk(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  } catch (error) {
    console.error(`Error en getOneUser con id ${id}`, error);
    throw error;
  }
};

const createUser = async (body) => {
  try {
    const { username, password, ...restOfData } = body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await sequelize.models.User.create({
      username,
      password: hashedPassword,
      ...restOfData,
    });
    return {
      id: newUser.id,
      username: newUser.username,
      ...restOfData,
    };
  } catch (error) {
    console.error('Error en createUser', error);
    throw error;
  }
};

const updateUser = async (id, body) => {
  try {
    const user = await sequelize.models.User.findByPk(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    const updatedUser = await user.update(body);
    console.log(`User with id ${id} updated`);
    return updatedUser;
  } catch (error) {
    console.error(`Error en updateUser con id ${id}`, error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const user = await sequelize.models.User.findByPk(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    await user.destroy();
    console.log(`User with id:${id} deleted`);
    return {
      id,
      deleted: true,
    };
  } catch (error) {
    console.error(`Error en deleteUser con id ${id}`, error);
    throw error;
  }
};

export { getAllUser, getOneUser, createUser, updateUser, deleteUser };
