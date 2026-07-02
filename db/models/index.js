import { Brand, BrandSchema } from './brand.model.js';
import { User, UserSchema } from './user.model.js';
import { Product, ProductSchema } from './product.model.js';
import { ProductSku, SkuSchema } from './skus.model.js';
import { Category, CategorySchema } from './category.model.js';
import { OrderDetails, OrderDetailsSchema } from './order.details.model.js';
import { Order, OrderSchema } from './order.model.js';
import { CartItem, CartItemSchema } from './cart.item.model.js';

const setupModels = (sequelize) => {
  User.init(UserSchema, User.config(sequelize));
  Brand.init(BrandSchema, Brand.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  ProductSku.init(SkuSchema, ProductSku.config(sequelize));
  Order.init(OrderSchema, Order.config(sequelize));
  OrderDetails.init(OrderDetailsSchema, OrderDetails.config(sequelize));
  CartItem.init(CartItemSchema, CartItem.config(sequelize));
  User.associate(sequelize.models);
  Brand.associate(sequelize.models);
  Category.associate(sequelize.models);
  Product.associate(sequelize.models);
  ProductSku.associate(sequelize.models);
  CartItem.associate(sequelize.models);
  Order.associate(sequelize.models);
  OrderDetails.associate(sequelize.models);
};

export default setupModels;
