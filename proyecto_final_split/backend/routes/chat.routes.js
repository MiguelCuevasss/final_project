const express = require('express');
const router = express.Router();
const axios = require('axios');
const Message = require('../models/Message');

// GET historial
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      error: 'Error obteniendo mensajes'
    });
  }
});

// POST mensaje
router.post('/', async (req, res) => {

  console.log('Mensaje recibido:', req.body);

  try {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'El mensaje es obligatorio'
      });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    const newMessage = new Message({
      userMessage: message,
      aiResponse
    });

    await newMessage.save();

    res.status(201).json(newMessage);

  } catch (error) {

    console.error('OpenRouter Error:', error.response?.data || error.message);

    res.status(500).json({
      error: 'Error al comunicarse con la IA'
    });
  }
});

// PATCH editar mensaje
router.patch('/:id', async (req, res) => {

  try {

    const { message } = req.body;

    const conversation = await Message.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversación no encontrada'
      });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    conversation.userMessage = message;
    conversation.aiResponse = response.data.choices[0].message.content;

    await conversation.save();

    res.status(200).json(conversation);

  } catch (error) {

    res.status(500).json({
      error: 'Error al actualizar la conversación'
    });

  }

});

module.exports = router;