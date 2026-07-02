import { DataTypes } from 'sequelize';
import { BrandSchema, BRAND_TABLE } from '../models/brand.model.js';
import { PRODUCT_TABLE, ProductSchema } from '../models/product.model.js';

export async function up(queryInterface) {
  await queryInterface.createTable(BRAND_TABLE, BrandSchema);
  const MigrationProductSchema = {
    ...ProductSchema,
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BRAND_TABLE,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
  };
  await queryInterface.createTable(PRODUCT_TABLE, MigrationProductSchema);
}

export async function down(queryInterface) {
  await queryInterface.dropTable(PRODUCT_TABLE);
  await queryInterface.dropTable(BRAND_TABLE);
}
