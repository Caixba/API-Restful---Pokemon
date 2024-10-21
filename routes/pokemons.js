const {Router} = require('express');
//const router = express.Router();

const{
    get_all_pokemons,
    save_pokemon,
    get_pokemon_by_id_body,
    update_pokemon_body,
    update_pokemon,
    delete_pokemon
} = require('../controllers/pokemons');

const {validarJWT} = require('../helpers/validar-jwt');

const router = Router();

router.get('/get_all', get_all_pokemons); 
router.get('/get_by_id_body', get_pokemon_by_id_body); 
router.post('/save', save_pokemon);
router.put('/update/:id', update_pokemon);
router.delete('/delete/:id',[validarJWT], delete_pokemon);

module.exports = router;


module.exports = {
    get_all_pokemons,
    save_pokemon,
    get_pokemon_by_id_body,
    update_pokemon_body,
    update_pokemon,
    delete_pokemon
 }