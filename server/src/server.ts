import app from './app';
import connectToDB from './configs/dbConn';
import Logger from './utils/logger';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectToDB();
  Logger.info(`App is listening at http://localhost:${PORT}`);
});
