import sequelize from '../libs/sequelize.js';

const getAllCategories = async () => {
  try {
    const categories = await sequelize.models.Category.findAll({
      include: ['products'],
    });
    return categories;
  } catch (error) {
    console.error('Error en getAllCategories', error);
    throw error;
  }
};

const getOneCategory = async (id) => {
  try {
    const category = await sequelize.models.Category.findByPk(id, {
      include: [
        {
          model: sequelize.models.Product,
          as: 'products',
          include: [
            {
              model: sequelize.models.Brand,
              as: 'brand',
              attributes: ['name'],
            },
          ],
        },
      ],
    });
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    return category;
  } catch (error) {
    console.error(`Error en getOneCategory con id ${id}`, error);
    throw error;
  }
};

const createCategory = async (body) => {
  try {
    const newCategory = await sequelize.models.Category.create(body);
    return newCategory;
  } catch (error) {
    console.error('Error en createCategory', error);
    throw error;
  }
};

const updateCategory = async (id, body) => {
  try {
    const category = await sequelize.models.Category.findByPk(id);
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    const updatedCategory = await category.update(body);
    console.log(`Category with id ${id} updated`);
    return updatedCategory;
  } catch (error) {
    console.error(`Error en updateCategory con id ${id}`, error);
    throw error;
  }
};

const deleteCategory = async (id) => {
  try {
    const category = await sequelize.models.Category.findByPk(id);
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    await category.destroy();
    console.log(`Category with id:${id} deleted`);
    return {
      id,
      deleted: true,
    };
  } catch (error) {
    console.error(`Error en deleteCategory con id ${id}`, error);
    throw error;
  }
};

export {
  getAllCategories,
  getOneCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
