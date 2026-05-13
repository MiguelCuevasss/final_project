// Archivo principal del backend.
// Inicializa Express, configura variables de entorno,
// conecta a MongoDB y monta las rutas de la API.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const groupsRoutes = require('./routes/groups.routes');

dotenv.config();

const connectDB = require('./config/db');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware básico para permitir comunicación
// entre frontend y backend, y para leer JSON.
app.use(cors());
app.use(express.json());


// Ruta base para verificar que la API está activa.
app.get('/', (req, res) => {
res.json({
message: 'API de Chat con IA funcionando correctamente'
});
});


// Montaje de las rutas principales del backend.
// Aquí se conectan chat, autenticación y grupos.
const chatRoutes = require('./routes/chat.routes');
const authRoutes = require('./routes/auth.routes');
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupsRoutes);


// Arranque del servidor en el puerto configurado.
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});