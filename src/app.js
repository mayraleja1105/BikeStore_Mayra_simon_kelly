const express = require('express');
const cors = require('cors');
const app = express();
const imagenesRoutes = require('./routes/imagenes.routes');
const db = require('./config/db');

// Middlewares
// Configuración de CORS para permitir solicitudes desde Live Server
app.use(cors({
  origin: 'http://127.0.0.1:5501', // <- Aquí el puerto correcto
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
 // Permite el envío de cookies de origen cruzado
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('src/frontend')); // Servir archivos estáticos desde src/frontend

// Rutas
app.use('/api/imagenes', imagenesRoutes);
app.use('/api/personas', require('./routes/personas.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/productos', require('./routes/productos.routes'));
app.use('/api/ventas', require('./routes/ventas.routes'));
app.use('/api/stocks', require('./routes/stocks.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));


// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

module.exports = app;
