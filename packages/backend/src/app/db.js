import mongoose from 'mongoose';

export const connectToDB = async (dbUri) => {
  const options = {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    }
  };

  await mongoose.connect(dbUri, options);

  await mongoose.connection.db.admin().ping();

  console.log("Pinged your deployment. You successfully connected to MongoDB!");

  return mongoose.connection;
};