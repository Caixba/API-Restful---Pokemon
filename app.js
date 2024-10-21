const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const mongoDBURI = 'mongodb://localhost:27017/pokemonsapi';

// Conexión a MongoDB
mongoose.connect(mongoDBURI, {})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

app.use('/api/pokemons', require('./routes/pokemons'));