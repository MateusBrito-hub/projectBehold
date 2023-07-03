const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Return my ping!'),
        
        async execute(interaction,client) {
            const select = new StringSelectMenuBuilder()
                .setCustomId('sub-menu')
                .setPlaceholder('Make a selection!')
                .addOptions(new StringSelectMenuOptionBuilder({
                    label: 'Bulbasaur',
                    value: 'bulbasaur'
                }), new StringSelectMenuOptionBuilder({
                    label: 'Charmander',
                    value: 'charmander'
                }), new StringSelectMenuOptionBuilder({
                    label: 'Squirtel',
                    value: 'squirtel'
                }),
                        
                );
    
            const row = new ActionRowBuilder()
                .addComponents(select);
    
            await interaction.reply({
                content: 'Choose your starter!',
                components: [row],
            });
        },
};