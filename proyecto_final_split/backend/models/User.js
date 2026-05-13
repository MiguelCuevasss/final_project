// Este archivo define el modelo User de MongoDB.
// Representa a los usuarios registrados dentro de SplitItEasy.

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    description: { type: String, default: '', trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);