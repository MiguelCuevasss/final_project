// Rutas del asistente de IA y manejo de conversaciones.
// Este archivo permite:
// - obtener historial de mensajes,
// - enviar mensajes a la IA,
// - analizar imágenes,
// - editar conversaciones guardadas.

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Message = require('../models/Message');
const multer = require('multer');

const upload = multer();

function getFixedAnswer(message = '') {
  const normalized = message.trim().toLowerCase();

  if (
    normalized === 'quien eres' ||
    normalized === 'quién eres' ||
    normalized.includes('quien eres') ||
    normalized.includes('quién eres')
  ) {
    return 'Soy SplitItEasy AI. Ayudo a dividir gastos, analizar facturas y administrar grupos.';
  }

  if (
    normalized === 'que haces' ||
    normalized === 'qué haces' ||
    normalized.includes('que haces') ||
    normalized.includes('qué haces') ||
    normalized.includes('para que sirves') ||
    normalized.includes('para qué sirves')
  ) {
    return 'Ayudo a dividir gastos, analizar facturas y administrar grupos.';
  }

  return null;
}

// Obtiene todas las conversaciones guardadas
// en MongoDB ordenadas por fecha de creación.
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Error obteniendo mensajes'
    });
  }
});

// Envía un mensaje al modelo de IA.
// También permite subir imágenes para analizar facturas
// y ayudar con división de gastos.
router.post('/', upload.single('image'), async (req, res) => {
  console.log('Mensaje recibido:', req.body);

  try {
    const { message } = req.body;

    // Convierte la imagen recibida en base64
    // para enviarla al modelo de IA.
    const imageBase64 = req.file ? req.file.buffer.toString('base64') : null;

    if (!message && !imageBase64) {
      return res.status(400).json({
        error: 'El mensaje es obligatorio'
      });
    }

    // Respuestas fijas para preguntas específicas.
    const fixedAnswer = getFixedAnswer(message || '');
    if (fixedAnswer) {
      const newMessage = new Message({
        userMessage: message || '',
        aiResponse: fixedAnswer
      });

      await newMessage.save();

      return res.status(201).json(newMessage);
    }

    // Petición a OpenRouter usando GPT-4o-mini.
    // Se envía el mensaje del usuario y opcionalmente
    // una imagen para análisis.
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `
Eres SplitItEasy AI.

Ayudas a dividir gastos,
analizar facturas y administrar grupos.

Si recibes una imagen:
- analiza la factura
- identifica precios
- ayuda a dividir gastos
- responde claramente

Responde siempre en español.
            `.trim()
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: message || 'Analiza esta imagen'
              },
              ...(imageBase64
                ? [
                    {
                      type: 'image_url',
                      image_url: {
                        url: `data:image/jpeg;base64,${imageBase64}`
                      }
                    }
                  ]
                : [])
            ]
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

    const aiResponse = response.data.choices?.[0]?.message?.content || '';

    // Guarda la conversación completa
    // dentro de MongoDB.
    const newMessage = new Message({
      userMessage: message || '',
      aiResponse
    });

    await newMessage.save();

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error('OpenRouter Error:', error.response?.data || error.message);

    return res.status(500).json({
      error: 'Error al comunicarse con la IA'
    });
  }
});

// Permite editar un mensaje previamente guardado.
// La IA genera una nueva respuesta basada
// en el nuevo contenido enviado.
router.patch('/:id', async (req, res) => {
  try {
    const { message } = req.body;

    const conversation = await Message.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversación no encontrada'
      });
    }

    const fixedAnswer = getFixedAnswer(message || '');
    if (fixedAnswer) {
      conversation.userMessage = message;
      conversation.aiResponse = fixedAnswer;

      await conversation.save();

      return res.status(200).json(conversation);
    }

    // Genera una nueva respuesta de IA
    // usando el mensaje actualizado.
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `
Eres SplitItEasy AI.

Ayudas a dividir gastos,
analizar facturas y administrar grupos.

Responde siempre en español.
            `.trim()
          },
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
    conversation.aiResponse = response.data.choices?.[0]?.message?.content || '';

    await conversation.save();

    return res.status(200).json(conversation);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Error al actualizar la conversación'
    });
  }
});

// Exporta las rutas para ser utilizadas
// por el servidor principal.
module.exports = router;