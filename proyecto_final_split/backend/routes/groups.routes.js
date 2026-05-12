const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Group = require('../models/Group');

function buildUserResponse(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    lastname: user.lastname,
    username: user.username,
    email: user.email,
    description: user.description || ''
  };
}

function buildMessageResponse(message) {
  const author = message.authorId || {};

  return {
    id: message._id.toString(),
    authorId: author._id ? author._id.toString() : String(message.authorId || ''),
    authorName: message.authorName || author.name || 'Usuario',
    text: message.text,
    createdAt: message.createdAt
  };
}

function buildGroupResponse(group) {
  const createdBy =
    group.createdBy && group.createdBy._id
      ? group.createdBy
      : null;

  return {
    id: group._id.toString(),
    name: group.name,
    createdById: createdBy ? createdBy._id.toString() : String(group.createdBy || ''),
    members: (group.members || []).map((member) => {
      const user = member.user || {};
      return {
        id: user._id ? user._id.toString() : String(member.user || ''),
        name: user.name || '',
        lastname: user.lastname || '',
        username: user.username || '',
        email: user.email || ''
      };
    }),
    messages: (group.messages || []).map(buildMessageResponse),
    createdAt: group.createdAt,
    updatedAt: group.updatedAt
  };
}

async function populateGroup(group) {
  return group.populate([
    { path: 'createdBy', select: 'name lastname username email description' },
    { path: 'members.user', select: 'name lastname username email description' },
    { path: 'messages.authorId', select: 'name lastname username email description' }
  ]);
}

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const groups = await Group.find({
      $or: [
        { createdBy: userId },
        { 'members.user': userId }
      ]
    })
      .sort({ updatedAt: -1 })
      .populate([
        { path: 'createdBy', select: 'name lastname username email description' },
        { path: 'members.user', select: 'name lastname username email description' },
        { path: 'messages.authorId', select: 'name lastname username email description' }
      ]);

    return res.json({
      success: true,
      groups: groups.map(buildGroupResponse)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate([
      { path: 'createdBy', select: 'name lastname username email description' },
      { path: 'members.user', select: 'name lastname username email description' },
      { path: 'messages.authorId', select: 'name lastname username email description' }
    ]);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado'
      });
    }

    return res.json({
      success: true,
      group: buildGroupResponse(group)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    const createdById = (req.body.createdById || '').trim();

    if (!name || !createdById) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos para crear el grupo'
      });
    }

    const creator = await User.findById(createdById);
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: 'Usuario creador no encontrado'
      });
    }

    const group = new Group({
      name,
      createdBy: creator._id,
      members: [
        {
          user: creator._id
        }
      ],
      messages: []
    });

    await group.save();
    await populateGroup(group);

    return res.status(201).json({
      success: true,
      message: 'Grupo creado correctamente',
      group: buildGroupResponse(group)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

router.post('/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const identifier = (req.body.identifier || '').trim().toLowerCase();

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Debes escribir un usuario o correo'
      });
    }

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado'
      });
    }

    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Ese usuario no existe'
      });
    }

    const alreadyMember = group.members.some(
      (member) => member.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'Ese usuario ya pertenece al grupo'
      });
    }

    group.members.push({ user: user._id });
    await group.save();
    await populateGroup(group);

    return res.json({
      success: true,
      message: 'Miembro agregado correctamente',
      group: buildGroupResponse(group)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

router.post('/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = (req.body.authorId || '').trim();
    const text = (req.body.text || '').trim();

    if (!authorId || !text) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos para enviar el mensaje'
      });
    }

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado'
      });
    }

    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const isMember =
      group.createdBy.toString() === author._id.toString() ||
      group.members.some((member) => member.user.toString() === author._id.toString());

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'No perteneces a este grupo'
      });
    }

    group.messages.push({
      authorId: author._id,
      authorName: author.name,
      text
    });

    await group.save();
    await populateGroup(group);

    return res.json({
      success: true,
      message: 'Mensaje guardado',
      group: buildGroupResponse(group)
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