import mongoose from 'mongoose';
import Logger from '@/utils/logger';

mongoose.set('strictQuery', false); // To prepare for future mongoose change
mongoose.set('runValidators', true); // To run mongoose Schema validations upon update

const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);

    if (conn) {
      Logger.info(`Connected to DB: ${conn.connection.host}`);
    }
  } catch (error) {
    Logger.error(error);
    process.exit(1);
  }
};

export default connectToDB;
