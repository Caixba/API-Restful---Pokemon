const {response} = require('express');
const {pokemons} = require('../models/datos-pokemons');
const {pokemonSchema} = require('../schemas/schemas');

//Generar la Conexón a MongoDB
mongoose.connect('mongodb://localhost:27017/vuejs');
const db = mongoose.connection;

// Creación de Modelos 
const Pokemon = mongoose.model('Pokemon',pokemonSchema);

/**
 * Obtiene lista de todos los usuarios de la base de datos
 * @param {*} req 
 * @param {*} res 
 */
const get_all_pokemons = (async(req, res = response) =>{
    try{
        const pokemon = await db.collection('pokemons').find().toArray();
        res.json({ pokemon });
        console.log("Respuesta:\n",pokemon);
    }catch(error){
        console.error('Error al obtener pokemons: ',error);
        res.status(500).json({ error: 'Error Interno del Servidor'});
    }
});


/*const pokemonsPost = (req, res = response)=>{
    const pok = req.body;
    const nuevoPokemon = {
        id: parseInt(pok.id),
        nombre: pok.nombre,
        tipo: pok.tipo,
        imgurl: pok.imgurl
    }
    pokemons.push(nuevoPokemon);
    console.log(pokemons);
    res.json({
     msg: `El pokemon ${nuevoPokemon.nombre} se ha creado`
    }); 
 }*/
/**
 * Registra un pokemon en base de datos
 * @param {*} req 
 * @param {*} res 
 */
const save_pokemon = (async(req, res = response) => {
    try {
        const pokemon = new Pokemon({
            id: new mongoose.Types.ObjectId(),
            ...req.body
        });
        const resultado = await pokemon.save();
        res.status(201).send(resultado);
    } catch (error) {
        res.status(400).send(error);
    }
});


/**
 * Obtiene un pokemon por ID,  _id viene en el cuertpo de la solicitud
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const get_pokemon_by_id_body = (async(req, res = response)=>{
    try{
        const {_id} = req.body;
        if(!_id){
            return res.sta|(400).json({mensaje:'requiere de un ID'});
        }
        const pokemon = await {Pokemon}.findById(_id);
        if(!pokemon){
            return res.status(400).json({
                mensaje: 'ID de Pokemon no fue localizado'
            });
        }
        res.json(pokemon);
    }catch(error){
        console.error('Error al buscar pokemon por ID: ',error);
        res.status(500).json({mensaje:'Error interno del servidor'});
    }
});


/**
 * Actualiza a un pokemon, el _id viene en el cuerpo de la solicitud
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const update_pokemon_body = (async(req, res = response)=>{
    try{
        const {_id, nombre, tipo} = req.body;
        if(!_id ||( !nombre && !tipo)){
            return res.status(400).json({
                mensaje: 'Se requiere proporcionar ID y al menos campos a actualizar (nombre, tipo'
            });
        }
        const pokemonActualizado = await Pokemon.findByIdAndUpdate(_id,{nombre, tipo}, {new : true});
        if(!pokemonActualizado){
            res.status(404).json({mensaje:'Pokemon no fue encontrado'});
        }
        res.json(pokemonActualizado);
    }catch(error){
        console.error('Error al actualizar pokemon por ID: ', error);
        res.status(500).json({mensaje:'Error interno del servidor'});
    }
});

/**
 * Actualiza la información del pokemon, el id viene en el parámetro de segmento
 * @param {*} req 
 * @param {*} res 
 * @returns usuario actualizado
 */
const update_pokemon = (async(req, res = response) => {
    try {
        const { id } = req.params;
        const actualizaciones = req.body;
        const pokemonActualizado = await Pokemon.findByIdAndUpdate(id, actualizaciones, { new: true, runValidators: true });
        
        if (!pokemonActualizado) {
            return res.status(404).send({mensaje: 'Pokemon no encontrado' });
        }
        
        res.send(pokemonActualizado);
    } catch (error) {
        res.status(400).send(error);
    }
});


/**
 * Elimina pokemon
 * @param {*} req 
 * @param {*} res 
 * @returns mensaje de eliminación
 */
const delete_pokemon = (async(req, res = response) => {
    try {
        const { id } = req.params;
        const pokemonEliminado = await Pokemon.findByIdAndDelete(id);
        if (!pokemonEliminado) {
            return res.status(404).send({ mensaje: 'Pokemon no encontrado' });
        }        
        res.send({ mensaje: 'Pokemon eliminado exitosamente' });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = {
    get_all_pokemons,
    save_pokemon,
    get_pokemon_by_id_body,
    update_pokemon_body,
    update_pokemon,
    delete_pokemon
 }
 /* Solo cambia el url de la imagen del pokemon 
const pokemonsPatch = (req, res = response) => {
   const { id } = req.params;
   const { imgurl } = req.body;
   let index = pokemons.findIndex(p => p.id === parseInt(id));
   if (index !== -1) {
       pokemons[index].imgurl = imgurl;
       res.json(pokemons[index]);
   } else {
       res.status(404).json({
           msg: 'Pokemon no encontrado'
       });
   }
}

 Actualiza completamente un pokemon existente por su ID
const pokemonsPut = (req, res = response) => {
   const { id } = req.params;
   const { nombre, tipo, imgurl } = req.body;
   let index = pokemons.findIndex(p => p.id === parseInt(id));
   if (index !== -1) {
       pokemons[index] = { id: parseInt(id), nombre, tipo, imgurl };
       res.json({
           msg: `El pokemon con ID ${id} ha sido actualizado`,
           pokemon: pokemons[index]
       });
   } else {
       res.status(404).json({
           msg: 'Pokemon no encontrado'
       });
   }
}

 Elimina un pokemon por su ID
const pokemonsDelete = (req, res = response) => {
   const { id } = req.params;
   let index = pokemons.findIndex(p => p.id === parseInt(id));
   if (index !== -1) {
       const deletedPokemon = pokemons.splice(index, 1);
       res.json({
           msg: `El pokemon con ID ${id} ha sido eliminado`,
           pokemon: deletedPokemon[0]
       });
   } else {
       res.status(404).json({
           msg: 'Pokemon no encontrado'
       });
   }
}*/

 /*module.exports = {
    pokemonsDelete,
    pokemonsGet,
    pokemonsPatch,
    pokemonsPut,
    pokemonsPost
 }*/