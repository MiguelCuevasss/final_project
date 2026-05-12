const express = require('express');
const router = express.Router();

const User = require('../models/User');

const buildUserResponse = (user) => ({
  id: user._id.toString(),
  name: user.name,
  lastname: user.lastname,
  username: user.username,
  email: user.email,
  description: user.description || ''
});

router.post('/register', async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    const lastname = (req.body.lastname || '').trim();
    const username = (req.body.username || '').trim().toLowerCase();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    const description = (req.body.description || '').trim();

    if (!name || !lastname || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
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
      password,
      description
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado',
      user: buildUserResponse(newUser)
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const identifier = (req.body.identifier || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Faltan credenciales'
      });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    return res.json({
      success: true,
      message: 'Login exitoso',
      user: buildUserResponse(user)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

router.get('/me/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.json({
      success: true,
      user: buildUserResponse(user)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

router.put('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const description = (req.body.description || '').trim();

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y correo son obligatorios'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const emailInUse = await User.findOne({
      _id: { $ne: id },
      email
    });

    if (emailInUse) {
      return res.status(400).json({
        success: false,
        message: 'Ese correo ya está en uso'
      });
    }

    user.name = name;
    user.email = email;
    user.description = description;

    await user.save();

    return res.json({
      success: true,
      message: 'Perfil actualizado',
      user: buildUserResponse(user)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

module.exports = router;