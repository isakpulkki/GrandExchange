const express = require('express');
const Conversation = require('../models/conversation');
const middleware = require('../utils/middleware');
const conversationsRouter = express.Router();
const { MESSAGE_LIMITS } = require('../utils/config');

conversationsRouter.get('/', middleware.userExtractor, async (req, res) => {
  const currentUser = req.user.username;

  try {
    const conversations = await Conversation.find({
      participants: currentUser,
    });

    if (!conversations || conversations.length === 0) {
      return res.status(404).json({ error: 'No conversations found.' });
    }
    const conversationSummaries = conversations.map((conversation) => {
      const otherParticipant = conversation.participants.find(
        (participant) => participant !== currentUser
      );

      const lastMessage =
        conversation.messages[conversation.messages.length - 1];

      return {
        otherParticipant,
        lastMessage,
      };
    });
    res.status(200).json({
      success: true,
      conversations: conversationSummaries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching conversations.');
  }
});

conversationsRouter.get(
  '/:participant',
  middleware.userExtractor,
  async (req, res) => {
    const user = req.user.username;
    const { participant } = req.params;

    try {
      const participants = [participant, user].sort();
      const conversation = await Conversation.findOne({ participants });

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found.' });
      }

      const messagesWithYou = conversation.messages.map((msg) => {
        if (msg.sender === user) {
          msg.sender = 'You';
        }
        return msg;
      });

      res.status(200).json({
        success: true,
        messages: messagesWithYou,
      });
    } catch (error) {
      res.status(500).send('Error fetching the conversation.');
    }
  }
);

conversationsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const { receiver, message } = req.body;
  const sender = req.user.username;

  if (!receiver || !message || message.length === 0) {
    return res.status(400).send('Receiver and message content are required.');
  }

  if (message.length > MESSAGE_LIMITS.MAX_LENGTH) {
    return res
      .status(400)
      .send('Message exceeds the maximum length of characters.');
  }

  try {
    if (sender === receiver) {
      return res.status(400).send('You cannot send a message to yourself.');
    }

    const participants = [sender, receiver].sort();
    let conversation = await Conversation.findOne({ participants });

    if (!conversation) {
      conversation = new Conversation({
        participants,
        messages: [],
      });
    }

    conversation.messages.push({
      sender,
      message,
      timestamp: new Date(),
    });

    await conversation.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      conversation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending the message.');
  }
});
module.exports = conversationsRouter;
