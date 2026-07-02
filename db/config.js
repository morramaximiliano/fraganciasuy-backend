const dbUser = encodeURIComponent(process.env.DB_USER || 'postgres');
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD || 'admin1234');
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';
const dbName = process.env.DB_NAME || 'perfumeria_db';

export default {
  development: {
    url: `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
