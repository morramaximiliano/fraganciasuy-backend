import { Sequelize, Model, DataTypes } from 'sequelize';

const BRAND_TABLE = 'brands';

const BrandSchema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
};

class Brand extends Model {
  static associate(models) {
    Brand.hasMany(models.Product, {
      foreignKey: 'brandId',
      as: 'products',
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: BRAND_TABLE,
      modelName: 'Brand',
      timestamps: false,
    };
  }
}

export { BRAND_TABLE, BrandSchema, Brand };
