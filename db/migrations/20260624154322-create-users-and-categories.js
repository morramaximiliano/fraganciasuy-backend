import { DataTypes } from 'sequelize';
import { USER_TABLE, UserSchema } from '../models/user.model.js';
import { CATEGORY_TABLE, CategorySchema } from '../models/category.model.js';

export async function up(queryInterface) {
  await queryInterface.createTable(USER_TABLE, UserSchema);
  await queryInterface.createTable(CATEGORY_TABLE, CategorySchema);
}

export async function down(queryInterface) {
  await queryInterface.dropTable(CATEGORY_TABLE);
  await queryInterface.dropTable(USER_TABLE);
}
