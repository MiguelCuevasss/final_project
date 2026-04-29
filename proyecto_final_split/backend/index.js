const express = require('express');

const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Servidor funcionando correctamente'
  });
});
c
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});