const express = require('express');
const router = express.Router();
const axios = require('axios');

let conversations = [];

// GET - Obtener historial
router.get('/', (req, res) => {
  res.status(200).json(conversations);
});

// POST - Enviar mensaje a la IA
router.post('/', async (req, res) => {
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
        model: 'mistralai/mistral-7b-instruct:free',
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

    const conversation = {
      id: conversations.length + 1,
      userMessage: message,
      aiResponse,
      createdAt: new Date()
    };

    conversations.push(conversation);

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({
      error: 'Error al comunicarse con la IA',
      details: error.message
    });
  }
});

// PATCH - Editar mensaje y regenerar respuesta
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { message } = req.body;

    const conversation = conversations.find(c => c.id === id);

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversación no encontrada'
      });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct:free',
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
    conversation.updatedAt = new Date();

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar la conversación'
    });
  }
});

module.exports = router;