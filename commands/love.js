const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loveyou")
        .setDescription("Responde com a Pessoa que mais amo!"),

    async execute(interaction) {
        await interaction.reply("Ana Carla da Costa Gama Brito")
    }
}