import sequelize from '../libs/sequelize.js';

const getCartByUser = async (userId) => {
  try {
    const cartItems = await sequelize.models.CartItem.findAll({
      where: { userId },
      include: [
        {
          model: sequelize.models.ProductSku,
          as: 'sku',
          include: [
            {
              model: sequelize.models.Product,
              as: 'product',
              attributes: ['name', 'imageUrl'],
              include: [
                {
                  model: sequelize.models.Brand,
                  as: 'brand',
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
    });
    return cartItems;
  } catch (error) {
    console.error('Error en getCartByUser:', error);
    throw error;
  }
};

const syncEntireCart = async (userId, items) => {
  try {
    await sequelize.models.CartItem.destroy({
      where: { userId },
    });

    if (items && items.length > 0) {
      const itemsToInsert = items.map((item) => ({
        userId,
        skuId: item.skuId,
        quantity: item.quantity,
      }));

      await sequelize.models.CartItem.bulkCreate(itemsToInsert);
    }

    return await getCartByUser(userId);
  } catch (error) {
    console.error('Error en syncEntireCart:', error);
    throw error;
  }
};

const clearCart = async (userId) => {
  try {
    return await sequelize.models.CartItem.destroy({
      where: { userId },
    });
  } catch (error) {
    console.error('Error en clearCart:', error);
    throw error;
  }
};

export { getCartByUser, syncEntireCart, clearCart };
