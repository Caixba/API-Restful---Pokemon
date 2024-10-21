const {Schema, model} = require('mongoose');

const PokemonSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    imgurl: {
        type: String,
        required: true
    }
});