import sequelize from '../libs/sequelize.js';

const getAllProducts = async () => {
  try {
    const products = await sequelize.models.Product.findAll({
      include: ['category', 'brand'],
    });
    return products;
  } catch (error) {
    console.error('Error en getAllProducts', error);
    throw error;
  }
};

const getOneProduct = async (id) => {
  try {
    const product = await sequelize.models.Product.findByPk(id, {
      include: [
        { model: sequelize.models.Brand, as: 'brand', attributes: ['name'] },
        {
          model: sequelize.models.Category,
          as: 'category',
        },
        {
          model: sequelize.models.ProductSku,
          as: 'skus',
        },
      ],
    });
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  } catch (error) {
    console.error(`Error en getOneProduct con el id ${id}`, error);
    throw error;
  }
};

const createProduct = async (body) => {
  try {
    const newProduct = await sequelize.models.Product.create(body);
    return newProduct;
  } catch (error) {
    console.error('Error en createProduct', error);
    throw error;
  }
};

const updateProduct = async (id, body) => {
  try {
    const product = await sequelize.models.Product.findByPk(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    const updatedProduct = await product.update(body);
    return updatedProduct;
  } catch (error) {
    console.error(`Error en updateProduct con el id ${id}`, error);
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const product = await sequelize.models.Product.findByPk(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    await product.destroy();
    return {
      id,
      deleted: true,
    };
  } catch (error) {
    console.error(`Error en deleteProduct con el id ${id}`, error);
    throw error;
  }
};

export {
  getAllProducts,
  deleteProduct,
  getOneProduct,
  updateProduct,
  createProduct,
};
