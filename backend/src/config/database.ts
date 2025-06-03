import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  host: 'db',
  dialect: 'postgres',
  port: 5432
});

export const waitForDb = async (retries = 5, delay = 2000): Promise<void> => {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established.');
      return;
    } catch (err) {
      retries--;
      console.warn(`⏳ Retrying DB connection (${retries} tries left)...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error('❌ Unable to connect to the database after several attempts.');
};

export const initDb = async (): Promise<void> => {
  try {
    await waitForDb();
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized.');
  } catch (error) {
    console.error('❌ DB Init Error:', error);
    throw error;
  }
};

export default sequelize; 