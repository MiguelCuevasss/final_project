const express = require('express');
const router = express.Router();

const Group = require('../models/Group');

router.post('/', async (req, res) => {

  try {

    const { name, members } = req.body;

    const group = await Group.create({
      name,
      members
    });

    res.status(201).json(group);

  } catch (error) {

    res.status(500).json({
      error: 'Error creando grupo'
    });
  }
});

router.get('/', async (req, res) => {

  try {

    const groups = await Group.find()
      .populate('members');

    res.json(groups);

  } catch (error) {

    res.status(500).json({
      error: 'Error obteniendo grupos'
    });
  }
});

module.exports = router;