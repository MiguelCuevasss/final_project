// Rutas principales para manejo de grupos.
// Este archivo controla:
// - creación de grupos
// - obtención de grupos
// - miembros
// - mensajes grupales

const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Group = require('../models/Group');

function isObjectId(value) {
  return typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value);
}

function toId(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value._id) return value._id.toString();
  if (value.id) return value.id.toString();
  if (value.user) return toId(value.user);
  if (value.authorId) return toId(value.authorId);
  return '';
}


// Construye respuestas limpias y serializa
// la información de grupos, miembros y mensajes
// para enviarla correctamente al frontend.
function buildUserResponse(user) {
  return {
    id: user._id.toString(),
    name: user.name || '',
    lastname: user.lastname || '',
    username: user.username || '',
    email: user.email || '',
    description: user.description || ''
  };
}

async function serializeGroup(group) {
  const rawMembers = Array.isArray(group.members) ? group.members : [];
  const rawMessages = Array.isArray(group.messages) ? group.messages : [];

  const memberIds = [
    ...new Set(
      rawMembers
        .map((member) => toId(member.user || member))
        .filter(Boolean)
    )
  ];

  const authorIds = [
    ...new Set(
      rawMessages
        .map((message) => toId(message.authorId))
        .filter(Boolean)
    )
  ];

  const [memberUsers, authorUsers, creatorUser] = await Promise.all([
    memberIds.length
      ? User.find({ _id: { $in: memberIds.filter(isObjectId) } }).select('name lastname username email description')
      : [],
    authorIds.length
      ? User.find({ _id: { $in: authorIds.filter(isObjectId) } }).select('name lastname username email description')
      : [],
    group.createdBy && isObjectId(toId(group.createdBy))
      ? User.findById(toId(group.createdBy)).select('name lastname username email description')
      : null
  ]);

  const memberMap = new Map(memberUsers.map((u) => [u._id.toString(), u]));
  const authorMap = new Map(authorUsers.map((u) => [u._id.toString(), u]));

  return {
    id: group._id.toString(),
    name: group.name || '',
    createdById: creatorUser ? creatorUser._id.toString() : toId(group.createdBy),
    members: rawMembers.map((member) => {
      const memberId = toId(member.user || member);
      const user = memberMap.get(memberId);

      return {
        id: memberId,
        name: user?.name || '',
        lastname: user?.lastname || '',
        username: user?.username || '',
        email: user?.email || ''
      };
    }),
    messages: rawMessages.map((message) => {
      const authorId = toId(message.authorId);
      const author = authorMap.get(authorId);

      return {
        id: toId(message._id) || authorId || String(Date.now()),
        authorId,
        authorName: message.authorName || author?.name || 'Usuario',
        text: message.text || '',
        createdAt: message.createdAt || message.date || new Date()
      };
    }),
    createdAt: group.createdAt,
    updatedAt: group.updatedAt
  };
}


// Obtiene todos los grupos donde un usuario
// participa o fue creador.
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    let user = null;

    if (isObjectId(userId)) {
      user = await User.findById(userId);
    }

    if (!user) {
      const normalized = userId.trim().toLowerCase();
      user = await User.findOne({
        $or: [
          { username: normalized },
          { email: normalized }
        ]
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const groups = await Group.find({
      $or: [
        { createdBy: user._id },
        { 'members.user': user._id }
      ]
    }).sort({ updatedAt: -1 });

    const serializedGroups = await Promise.all(groups.map(serializeGroup));

    return res.json({
      success: true,
      groups: serializedGroups
    });
  } catch (error) {
    console.error('GET /api/groups/user/:userId', error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});


// Obtiene la información completa
// de un grupo específico.
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado'
      });
    }

    const serializedGroup = await serializeGroup(group);

    return res.json({
      success: true,
      group: serializedGroup
    });
  } catch (error) {
    console.error('GET /api/groups/:id', error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});


// Crea nuevos grupos y agrega automáticamente
// al creador como miembro inicial.
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

    const serializedGroup = await serializeGroup(group);

    return res.status(201).json({
      success: true,
      message: 'Grupo creado correctamente',
      group: serializedGroup
    });
  } catch (error) {
    console.error('POST /api/groups', error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});


// Agrega nuevos miembros a un grupo
// usando username o email.
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

    const alreadyMember = (group.members || []).some((member) => {
      return toId(member.user || member) === user._id.toString();
    });

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'Ese usuario ya pertenece al grupo'
      });
    }

    group.members.push({ user: user._id });
    await group.save();

    const serializedGroup = await serializeGroup(group);

    return res.json({
      success: true,
      message: 'Miembro agregado correctamente',
      group: serializedGroup
    });
  } catch (error) {
    console.error('POST /api/groups/:id/members', error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});


// Guarda mensajes dentro del chat grupal
// y verifica que el usuario pertenezca al grupo.
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
      toId(group.createdBy) === author._id.toString() ||
      (group.members || []).some((member) => {
        return toId(member.user || member) === author._id.toString();
      });

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

    const serializedGroup = await serializeGroup(group);

    return res.json({
      success: true,
      message: 'Mensaje guardado',
      group: serializedGroup
    });
  } catch (error) {
    console.error('POST /api/groups/:id/messages', error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// Exporta las rutas de grupos
// para utilizarlas en el servidor principal.
module.exports = router;