const { SlashCommandBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dice")
        .setDescription("Rola o dado")
        .addStringOption(option => option.setName('dado').setDescription('informe a rolagem').setRequired(true))
        .addStringOption(option => option.setName('adicional').setDescription('informe adicional')),

        

    async execute(interaction) {
        const options = interaction.options
        function generateRolls(qtdDice, qtdFace) {

            for( let i = 1; i <= qtdDice; i++) {
                const dice = Math.floor(Math.random() * qtdFace) + 1;
                rolls.push(dice)
            }
        
            const result = rolls.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0)
        
            return result 
        }

        const rolls = []
        const roll = options._hoistedOptions[0].value
        const slicer = roll.toLowerCase().split('d')
        const dices = slicer[0]
        const faces = slicer[1]
        const qtdDice = parseInt(dices)
        const qtdFace = parseInt(faces)
        const rollsResult = generateRolls(qtdDice, qtdFace)

        if(options._hoistedOptions.length === 1){
            await interaction.reply(`${roll}!` + ` Os dados rolados foram ${rolls} e a soma deles foi igual a ${rollsResult}!`)
        }
        if(options._hoistedOptions.length === 2){
            const add = options._hoistedOptions[1].value
            const addvalue = parseInt(add)
            await interaction.reply(`${roll}!` + ` Os dados rolados foram [${rolls }] e a soma deles com o acrecimo de ${addvalue} foi igual a ${rollsResult + addvalue}!`)
        }
        
    }
}