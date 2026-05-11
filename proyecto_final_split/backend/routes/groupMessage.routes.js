const express = require('express');
const router = express.Router();

const GroupMessage = require('../models/GroupMessage');

router.post('/', async (req, res) => {

  try {

    const message = await GroupMessage.create(req.body);

    res.status(201).json(message);

  } catch (error) {

    res.status(500).json({
      error: 'Error enviando mensaje'
    });
  }
});

router.get('/:groupId', async (req, res) => {

  try {

    const messages = await GroupMessage.find({
      groupId: req.params.groupId
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {

    res.status(500).json({
      error: 'Error obteniendo mensajes'
    });
  }
});

module.exports = router;