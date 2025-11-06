require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'La API de The Menu está en ejecución',
    version: '1.0.0'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
});

app.listen(PORT, () => {
  console.log(`El servidor está ejecutándose en el puerto ${PORT}`);
});