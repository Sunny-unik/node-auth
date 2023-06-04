import mongoose from 'mongoose';

export default async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const { host, port, name } = conn.connection;
    console.log(`MongoDB Connected at mongodb://${host}/${port}, DB: ${name}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit();
  }
};
