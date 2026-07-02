import { Sequelize, Model, DataTypes } from 'sequelize';

const SKU_TABLE = 'skus';

const SkuSchema = {
  id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'product_id',
  },
  sizeMl: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'size_ml',
  },
  price: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  skuCode: {
    type: DataTypes.STRING,
    unique: true,
    field: 'sku_code',
  },
};

class ProductSku extends Model {
  static associate(models) {
    ProductSku.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: SKU_TABLE,
      modelName: 'ProductSku',
      timestamps: false,
    };
  }
}

export { SKU_TABLE, SkuSchema, ProductSku };
