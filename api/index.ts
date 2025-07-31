import serverless from 'serverless-http';
import app from '../src/app';
import mongoose from 'mongoose';

let isConnected = false;

const connectDb = async () => {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
  }
};

app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectDb();
  }
  next();
});
 const handler = serverless(app);

export default handler;
