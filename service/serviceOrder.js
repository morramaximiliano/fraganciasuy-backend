import sequelize from '../libs/sequelize.js';

const createOrder = async (userId, orderData) => {
  const { shippingAddress, paymentMethod } = orderData;

  const t = await sequelize.transaction();

  try {
    const cartItems = await sequelize.models.CartItem.findAll({
      where: { userId },
      include: [
        {
          model: sequelize.models.ProductSku,
          as: 'sku',
          attributes: ['id', 'price'],
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
      transaction: t,
    });

    if (!cartItems || cartItems.length === 0) {
      throw new Error('CART_IS_EMPTY');
    }

    const calculatedTotal = cartItems.reduce((sum, item) => {
      const price = Number(item.sku.price);
      return sum + item.quantity * price;
    }, 0);

    const newOrder = await sequelize.models.Order.create(
      {
        userId,
        totalAmount: calculatedTotal,
        status: 'pending',
        shippingAddress,
        paymentMethod,
      },
      { transaction: t },
    );

    const orderDetailsData = cartItems.map((item) => {
      return {
        orderId: newOrder.id,
        skuId: item.skuId,
        quantity: item.quantity,
        priceAtPurchase: Number(item.sku.price),
      };
    });

    await sequelize.models.OrderDetails.bulkCreate(orderDetailsData, {
      transaction: t,
    });

    const itemsMercadoPago = cartItems.map((item) => {
      return {
        id: item.sku.id.toString(),

        title: item.sku.product.name,
        quantity: Number(item.quantity),
        unit_price: Number(item.sku.price),
        currency_id: 'UYU',
      };
    });

    await sequelize.models.CartItem.destroy({
      where: { userId },
      transaction: t,
    });

    await t.commit();

    return {
      newOrder,
      itemsMercadoPago,
    };
  } catch (error) {
    await t.rollback();
    console.error('Error en createOrder:', error);
    throw error;
  }
};

const getOrdersByUser = async (userId) => {
  try {
    const orders = await sequelize.models.Order.findAll({
      where: { userId },
      order: [['id', 'DESC']],
    });
    return orders;
  } catch (error) {
    console.error('Error en getOrdersByUser:', error);
    throw error;
  }
};

const getOrderById = async (userId, orderId) => {
  try {
    const order = await sequelize.models.Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: sequelize.models.ProductSku,
          as: 'sku',
          attributes: ['id', 'name'],
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

    if (!order) {
      throw new Error('ORDER_NOT_FOUND');
    }

    return order;
  } catch (error) {
    console.error('Error en getOrderById:', error);
    throw error;
  }
};

const getAllOrders = async () => {
  try {
    const orders = await sequelize.models.Order.findAll();
    return orders;
  } catch (error) {
    console.error('Error en getAllOrders', error);
    throw error;
  }
};

export { createOrder, getOrdersByUser, getOrderById, getAllOrders };
