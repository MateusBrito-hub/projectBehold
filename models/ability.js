const mongoose = require('mongoose');

const abilitySchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    charClass: String,
    ability: [{
        level: Number,
        name: String,
        description: String
    }]
})

const Ability = mongoose.model('Ability', abilitySchema)
module.exports = Ability