import mongoose from 'mongoose';

export default async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI +
        (process.env.NODE_ENV === 'test' ? 'testNodeAuth' : 'NodeAuth') +
        '?readPreference=primary&retryWrites=true',
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const { host, port, name } = conn.connection;

    console.log(`MongoDB Connected at mongodb://${host}/${port}, DB: ${name}`);
  } catch (error) /* istanbul ignore next */ {
    console.error('\x1b[31m%s\x1b[0m', `Error: ${error}`);
    process.exit();
  }
};
