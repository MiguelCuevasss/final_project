const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const groupsRoutes = require('./routes/groups.routes');

dotenv.config();

const connectDB = require('./config/db');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
res.json({
message: 'API de Chat con IA funcionando correctamente'
});
});

const chatRoutes = require('./routes/chat.routes');
const authRoutes = require('./routes/auth.routes');
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});