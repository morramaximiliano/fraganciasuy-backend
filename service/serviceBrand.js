import sequelize from '../libs/sequelize.js';

const getAllBrands = async () => {
  try {
    const brand = await sequelize.models.Brand.findAll();
    return brand;
  } catch (error) {
    console.error('Error en getAllBrands', error);
    throw error;
  }
};

const getOneBrand = async (id) => {
  try {
    const brand = await sequelize.models.Brand.findByPk(id);
    if (!brand) {
      throw new Error(`Brand with id ${id} not found`);
    }
    return brand;
  } catch (error) {
    console.error(`Error en getOneBrand con id ${id}`, error);
    throw error;
  }
};

const createBrand = async (body) => {
  try {
    const newBrand = await sequelize.models.Brand.create(body);
    return newBrand;
  } catch (error) {
    console.error('Error en createBrand', error);
    throw error;
  }
};

const updateBrand = async (id, body) => {
  try {
    const brand = await sequelize.models.Brand.findByPk(id);
    if (!brand) {
      throw new Error(`Brand with id ${id} not found`);
    }
    const updatedBrand = await brand.update(body);
    console.log(`Brand with id ${id} updated`);
    return updatedBrand;
  } catch (error) {
    console.error(`Error en updateBrand con id ${id}`, error);
    throw error;
  }
};

const deleteBrand = async (id) => {
  try {
    const brand = await sequelize.models.Brand.findByPk(id);
    if (!brand) {
      throw new Error(`Brand with id ${id} not found`);
    }
    await brand.destroy();
    console.log(`Brand with id:${id} deleted`);
    return {
      id,
      deleted: true,
    };
  } catch (error) {
    console.error(`Error en deleteBrand con id ${id}`, error);
    throw error;
  }
};

export { getAllBrands, getOneBrand, createBrand, updateBrand, deleteBrand };
