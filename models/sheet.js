const { ObjectId } = require('mongodb')
const mongoose = require('mongoose');

const sheetSchema = new mongoose.Schema({
    id: ObjectId,
    playerName: String,
    charImg: String,
    sheetInfo: {
        charName: String,
        charClass: String,
        classLvl: Number,
        charRace: String,
        backgroundChar:String,
        alignment: String,
    },
    statusValue: {
        str: Number,
        dex: Number,
        con: Number,
        int: Number,
        wis: Number,
        cha: Number,
    },
    savingThrows: {
        stStr: Number,
        stDex: Number,
        stCon: Number,
        stInt: Number,
        stWis: Number,
        stCha: Number,
    },
    savingThrowsPro: {
        stStr: Boolean,
        stDex: Boolean,
        stCon: Boolean,
        stInt: Boolean,
        stWis: Boolean,
        stCha: Boolean,
    },
    charSkills:{
        acrobatics: Number,
        animalHandling: Number,
        arcana: Number,
        athletics: Number,
        deception: Number,
        history: Number,
        insight: Number,
        intimidation: Number,
        investigation: Number,
        medicine: Number, 
        nature: Number,
        perception: Number, 
        performance: Number,
        persuasion: Number,
        religion: Number,
        sleightofHand: Number,
        stealth: Number,
        survival: Number,
        passiveWisdom: Number,
    },
    charSkillsPro:{
        acrobatics: Boolean,
        animalHandling: Boolean,
        arcana: Boolean,
        athletics: Boolean,
        deception: Boolean,
        history: Boolean,
        insight: Boolean,
        intimidation: Boolean,
        investigation: Boolean,
        medicine: Boolean, 
        nature: Boolean,
        perception: Boolean, 
        performance: Boolean,
        persuasion: Boolean,
        religion: Boolean,
        sleightofHand: Boolean,
        stealth: Boolean,
        survival: Boolean,
        passiveWisdom: Boolean,
    }
})

const Sheet = mongoose.model('Sheet', sheetSchema)
module.exports = Sheet