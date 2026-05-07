const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

  userMessage: {
    type: String,
    required: true
  },

  aiResponse: {
    type: String,
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);