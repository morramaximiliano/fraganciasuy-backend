import { Sequelize } from 'sequelize';
import setupModels from '../db/models/index.js';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: true,
});

setupModels(sequelize);

sequelize.sync({ force: true }).then(() => {
  console.log('Tablas creadas exitosamente');
});

export default sequelize;
