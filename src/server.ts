import app from "@/app";
import connectToDB from "@/configs/dbConn";
import Logger from "@/utils/logger";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectToDB();
  Logger.info(`App is listening at http://localhost:${PORT}`);
});

// log unhandled rejections
process.on("unhandledRejection", (err) => {
  Logger.error(err);
  process.exit(1);
});

// Try this once for cluster using app.js and server.js file: https://www.softwareontheroad.com/nodejs-scalability-issues/
