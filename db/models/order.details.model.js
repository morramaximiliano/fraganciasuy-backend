import { Sequelize, DataTypes, Model } from 'sequelize';

const ORDER_DETAILS_TABLE = 'order_details';

const OrderDetailsSchema = {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'order_id',
    references: {
      model: 'orders',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  skuId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sku_id',
    references: {
      model: 'skus',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  priceAtPurchase: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'price_at_purchase',
  },
};

class OrderDetails extends Model {
  static associate(models) {
    OrderDetails.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
    });
    OrderDetails.belongsTo(models.ProductSku, {
      foreignKey: 'skuId',
      as: 'sku',
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_DETAILS_TABLE,
      modelName: 'OrderDetails',
      timestamps: false,
    };
  }
}

export { ORDER_DETAILS_TABLE, OrderDetailsSchema, OrderDetails };
