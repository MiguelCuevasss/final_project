const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {

    const {
      name,
      lastname,
      username,
      email,
      password
    } = req.body;

    const existingUser = await User.findOne({
      $or: [
        { email },
        { username }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Usuario o correo ya existe'
      });
    }

    const newUser = new User({
      name,
      lastname,
      username,
      email,
      password
    });

    await newUser.save();

    res.json({
      success: true,
      message: 'Usuario registrado'
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

router.post('/login', async (req, res) => {

  try {

    const {
      identifier,
      password
    } = req.body;

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    });

    if (!user || user.password !== password) {

      return res.status(400).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    res.json({
      success: true,
      message: 'Login exitoso',
      user
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

module.exports = router;