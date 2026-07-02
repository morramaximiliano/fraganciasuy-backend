import sequelize from '../libs/sequelize.js';

const getAllSkus = async () => {
  try {
    const skus = await sequelize.models.ProductSku.findAll({
      include: [
        {
          model: sequelize.models.Product,
          as: 'product',
          attributes: ['name'],
        },
      ],
    });
    return skus;
  } catch (error) {
    console.error('Error en getAllSkus', error);
    throw error;
  }
};

const getOneSku = async (id) => {
  try {
    const sku = await sequelize.models.ProductSku.findByPk(id, {
      include: ['product'],
    });
    if (!sku) {
      throw new Error(`Sku with id ${id} not found`);
    }
    return sku;
  } catch (error) {
    console.error(`Error en getOneSku con id ${id}`, error);
    throw error;
  }
};

const createSku = async (body) => {
  try {
    const newSku = await sequelize.models.ProductSku.create(body);
    return newSku;
  } catch (error) {
    console.error('Error en createSku', error);
    throw error;
  }
};

const updateSku = async (id, body) => {
  try {
    const sku = await sequelize.models.ProductSku.findByPk(id);
    if (!sku) {
      throw new Error(`Sku with id ${id} not found`);
    }
    const updatedSku = await sku.update(body);
    console.log(`Sku with id ${id} updated`);
    return updatedSku;
  } catch (error) {
    console.error(`Error en updateSku con id ${id}`, error);
    throw error;
  }
};

const deleteSku = async (id) => {
  try {
    const sku = await sequelize.models.ProductSku.findByPk(id);
    if (!sku) {
      throw new Error(`Sku with id ${id} not found`);
    }
    await sku.destroy();
    console.log(`Sku with id:${id} deleted`);
    return {
      id,
      deleted: true,
    };
  } catch (error) {
    console.error(`Error en deleteSku con id ${id}`, error);
    throw error;
  }
};

export { getAllSkus, getOneSku, createSku, updateSku, deleteSku };
