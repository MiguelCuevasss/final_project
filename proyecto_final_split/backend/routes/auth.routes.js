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

    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    });

    if (!user) {
      return res.status(400).json({
        message: 'Usuario no encontrado'
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Contraseña incorrecta'
      });
    }

    res.json({
      message: 'Login exitoso',
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error del servidor'
    });

  }

});

module.exports = router;