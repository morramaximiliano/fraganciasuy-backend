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
        userId: userId,
        skuId: item.skuId,
        quantity: item.quantity,
        brand: item.brand,
        imageUrl: item.imageUrl,
        stock: item.stock,
        price: item.price,
        name: item.name,
      }));

      await sequelize.models.CartItem.bulkCreate(itemsToInsert);
    }

    return await getCartByUser(userId);
  } catch (error) {
    console.error('Error en syncEntireCart:', error);
    throw error;
  }
};

const addItemToCart = async (userId, skuId, quantity) => {
  try {
    const existingItem = await sequelize.models.CartItem.findOne({
      where: { userId, skuId },
    });
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return existingItem;
    }
    const newItem = await sequelize.models.CartItem.create({
      userId,
      skuId,
      quantity,
    });
    return newItem;
  } catch (error) {
    console.error('Error en addItemToCart:', error);
    throw error;
  }
};

const updateCartItem = async (userId, cartItemId, quantity) => {
  try {
    const item = await sequelize.models.CartItem.findOne({
      where: { id: cartItemId, userId },
    });
    if (!item) throw new Error('CART_ITEM_NOT_FOUND');
    item.quantity = quantity;
    await item.save();
    return item;
  } catch (error) {
    console.error('Error en updateCartItem:', error);
    throw error;
  }
};

const deleteCartItem = async (userId, cartItemId) => {
  try {
    const deletedRows = await sequelize.models.CartItem.destroy({
      where: { id: cartItemId, userId },
    });
    if (deletedRows === 0) throw new Error('CART_ITEM_NOT_FOUND');
    return { id: cartItemId, deleted: true };
  } catch (error) {
    console.error('Error en deleteCartItem:', error);
    throw error;
  }
};

export {
  getCartByUser,
  syncEntireCart,
  addItemToCart,
  updateCartItem,
  deleteCartItem,
};
