import { Sequelize, DataTypes, Model } from 'sequelize';
import { USER_TABLE } from './user.model.js';

const CART_ITEM_TABLE = 'cart_items';

const CartItemSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: USER_TABLE,
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
    onDelete: 'CASCADE',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
};

class CartItem extends Model {
  static associate(models) {
    CartItem.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    CartItem.belongsTo(models.ProductSku, {
      foreignKey: 'skuId',
      as: 'sku',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CART_ITEM_TABLE,
      modelName: 'CartItem',
      timestamps: false,
    };
  }
}

export { CART_ITEM_TABLE, CartItemSchema, CartItem };
