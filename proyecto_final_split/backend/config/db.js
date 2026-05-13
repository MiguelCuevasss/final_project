// Este archivo se encarga de conectar el backend con la base de datos MongoDB Atlas usando Mongoose.

const mongoose = require('mongoose');

const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB conectado');

  } catch (error) {

    console.log('Error MongoDB:', error);

    process.exit(1);
  }
};

module.exports = connectDB;