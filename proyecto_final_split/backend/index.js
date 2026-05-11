const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const groupRoutes = require('./routes/group.routes');
app.use('/api/groups', groupRoutes);


const groupMessageRoutes = require(
  './routes/groupMessage.routes'
);

app.use(
  '/api/group-messages',
  groupMessageRoutes
);