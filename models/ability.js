const mongoose = require('mongoose');

const abilitySchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    class: String,
    ability: [{
        level: Number,
        name: String,
        description: String
    }]
})

const Ability= mongoose.model('Ability', abilitySchema)
module.exports = Ability