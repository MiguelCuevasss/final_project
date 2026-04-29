const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());


let messages = [];

const generateId = () => {
  return messages.length > 0
    ? messages[messages.length - 1].id + 1
    : 1;
};

app.post('/chat', (req, res) => {
  const { userMessage, amount } = req.body;

  const newMessage = {
    id: generateId(),
    userMessage,
    amount,
    botResponse: "Gasto registrado correctamente",
    date: new Date()
  };

  messages.push(newMessage);

  res.status(200).json(newMessage);
});

app.get('/chat', (req, res) => {
  res.status(200).json(messages);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});