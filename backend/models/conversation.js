const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: { type: [String], required: true },
  messages: [
    {
      sender: { type: String, required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Conversation', conversationSchema);
