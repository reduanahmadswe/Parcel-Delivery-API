import { connectDB } from './config/database';
import app from './app';
import serverless from 'serverless-http'; // এই লাইব্রেরিটা লাগবে

(async () => {
  await connectDB();
})();

const handler = serverless(app);

export default handler;
