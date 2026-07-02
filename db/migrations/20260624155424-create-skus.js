import { DataTypes } from 'sequelize';
import { SKU_TABLE, SkuSchema } from '../models/skus.model.js';

export async function up(queryInterface) {
  const MigrationSkuSchema = {
    ...SkuSchema,
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  };

  await queryInterface.createTable(SKU_TABLE, MigrationSkuSchema);
}

export async function down(queryInterface) {
  await queryInterface.dropTable(SKU_TABLE);
}
