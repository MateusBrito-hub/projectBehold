const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, ActionRowBuilder} = require('discord.js');
const {ButtonBuilder, ButtonStyle} = require('discord.js')
const Sheet = require('../models/sheet.js');
const char = {};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("personagem")
		.setDescription("Apresenta a ficha do personagem selecionado!")
		.addStringOption(option => option.setName('personagem').setDescription('Informe o Personagem desejado').setRequired(true)),

	async execute(interaction) {
		function findSheet(key, value) {
            const filter = {};
            filter[key] = value;
            return Sheet.findOne(filter)
                .then((document) => {
                    if (document) {
                        return document;
                    } else {
                        console.log('Documento não encontrado');
                        return null;
                    }
                })
                .catch((err) => {
                    console.error('Erro:', err);
                    return null;
                });
		}
        function attributeModifier(value) {
            if (value === 1) {
                return -5;
            } else if (value === 2 || value === 3) {
                return -4;
            } else if (value === 4 || value === 5) {
                return -3;
            } else if (value === 6 || value === 7) {
                return -2;
            } else if (value === 8 || value === 9) {
                return -1;
            } else if (value === 10 || value === 11) {
                return 0;
            } else if (value === 12 || value === 13) {
                return 1;
            } else if (value === 14 || value === 15) {
                return 2;
            } else if (value === 16 || value === 17) {
                return 3;
            } else if (value === 18 || value === 19) {
                return 4;
            } else if (value === 20 || value === 21) {
                return 5;
            } else if (value === 22 || value === 23) {
                return 6;
            } else if (value === 24 || value === 25) {
                return 7;
            } else if (value === 26 || value === 27) {
                return 8;
            } else if (value === 28 || value === 29) {
                return 9;
            } else if (value === 30) {
                return 10;
            }
        }

		async function createSheetInfoEmbed(sheetInfo) {
            const charImageUrl = char.sheet.charImg
            const embed1 = new EmbedBuilder()
                .setColor('#00FF00')
                .setImage(charImageUrl)
                .setTitle('Ficha de Personagem')
                .addFields(
                    { name: 'Nome:', value: `${sheetInfo.charName}` , inline: true},
                    { name: 'Classe:', value: `${sheetInfo.charClass}` , inline: true},
                    { name: 'Raça:', value: `${sheetInfo.charRace}`, inline: true },
                    { name: 'Antecendente:', value: `${sheetInfo.backgroundChar}` , inline: true},
                    { name: 'Alinhamento:', value: `${sheetInfo.alignment}` , inline: true},
                )
                .setFooter({text :'Página 1/4'});
            return embed1;
		}

		async function createStatusValueEmbed(statusValue) {
            const charImageUrl = char.sheet.charImg
            const embed2 = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Ficha de Personagem')
                .setImage(charImageUrl)
                .addFields(
                    { name: 'For:', value: `${statusValue.str} (${attributeModifier(statusValue.str)})` , inline: true},
                    { name: 'Des:', value: `${statusValue.dex} (${attributeModifier(statusValue.dex)})` , inline: true},
                    { name: 'Con:', value: `${statusValue.con} (${attributeModifier(statusValue.con)})` , inline: true},
                    { name: 'Int:', value: `${statusValue.int} (${attributeModifier(statusValue.int)})` , inline: true},
                    { name: 'Sab:', value: `${statusValue.wis} (${attributeModifier(statusValue.wis)})` , inline: true},
                    { name: 'Car:', value: `${statusValue.cha} (${attributeModifier(statusValue.cha)})` , inline: true},
                )
                .setFooter({text: 'Página 2/4'});

            return embed2;
		}
        async function createStatusThrowsEmbed(savingThrows) {
            const charImageUrl = char.sheet.charImg
            const embed3 = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Saving Throws')
                .setImage(charImageUrl)
                .addFields(
                    { name: 'For:', value: `${savingThrows.stStr}` , inline: true},
                    { name: 'Des:', value: `${savingThrows.stDex}` , inline: true},
                    { name: 'Con:', value: `${savingThrows.stCon}` , inline: true},
                    { name: 'Int:', value: `${savingThrows.stInt}` , inline: true},
                    { name: 'Sab:', value: `${savingThrows.stWis}` , inline: true},
                    { name: 'Car:', value: `${savingThrows.stCha}` , inline: true},
                )
                .setFooter({text: 'Página 3/4'});

            return embed3;
		}
        async function createCharSkillsEmbed(charSkills) {
            //const charImageUrl = char.sheet.charImg
            const embed4 = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Skills')
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Acrobacia:', value: `${charSkills.acrobatics}` , inline: true},
                    { name: 'Adestra Animais:', value: `${charSkills.animalHandling}` , inline: true},
                    { name: 'Arcanismo:', value: `${charSkills.arcana}` , inline: true},
                    { name: 'Atletismo:', value: `${charSkills.athletics}` , inline: true},
                    { name: 'Atuação:', value: `${charSkills.performance}` , inline: true},
                    { name: 'Enganação:', value: `${charSkills.deception}` , inline: true},
                    { name: 'Furtividade:', value: `${charSkills.stealth}` , inline: true},
                    { name: 'Historia:', value: `${charSkills.history}` , inline: true},
                    { name: 'Intuição:', value: `${charSkills.insight}` , inline: true},
                    { name: 'Intimidação:', value: `${charSkills.intimidation}` , inline: true},
                    { name: 'Investigação:', value: `${charSkills.investigation}` , inline: true},
                    { name: 'Medicina:', value: `${charSkills.medicine}` , inline: true},
                    { name: 'Natureza:', value: `${charSkills.nature}` , inline: true},
                    { name: 'Percepção:', value: `${charSkills.perception}` , inline: true},
                    { name: 'Persuasão:', value: `${charSkills.persuasion}` , inline: true},
                    { name: 'Prestidigitação:', value: `${charSkills.sleightofHand}` , inline: true},
                    { name: 'Religião:', value: `${charSkills.religion}` , inline: true},
                    { name: 'Sobrevivencia:', value: `${charSkills.survival}` , inline: true},
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Percepção Passiva:', value: `${10 + charSkills.passiveWisdom}`},
                )
                .setFooter({text: 'Página 4/4'});

            return embed4;
		}

		const personagem = interaction.options.getString('personagem');

		findSheet('sheetInfo.charName', personagem)
			.then((findDocument) => {
				char.sheet = findDocument;

				if (char.sheet) {
					const sheetInfoEmbedPromise = createSheetInfoEmbed(char.sheet.sheetInfo);
					const statusValueEmbedPromise = createStatusValueEmbed(char.sheet.statusValue);
                    const statusThrowsEmbedPromise = createStatusThrowsEmbed(char.sheet.savingThrows.value)
                    const charSkillsEmbedPromise = createCharSkillsEmbed(char.sheet.charSkills.value)
					Promise.all([sheetInfoEmbedPromise, statusValueEmbedPromise, statusThrowsEmbedPromise, charSkillsEmbedPromise])
						.then(([sheetInfoEmbed, statusValueEmbed, statusThrowsEmbed, charSkillsEmbed]) => {
							const pages = [sheetInfoEmbed, statusValueEmbed, statusThrowsEmbed, charSkillsEmbed];
							let currentPage = 0;

							const previousButton = new ButtonBuilder()
                                .setCustomId('previous')
                                .setLabel('Página Anterior')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === 0);

							const nextButton = new ButtonBuilder()
								.setCustomId('next')
								.setLabel('Próxima Página')
								.setStyle(ButtonStyle.Primary);

							const buttonRow = new ActionRowBuilder()
								.addComponents(previousButton, nextButton);

							interaction.reply({ embeds: [pages[currentPage]], components: [buttonRow] })
								.then((message) => {
									const collector = message.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id });

									collector.on('collect', (buttonInteraction) => {
                                        if (buttonInteraction.customId === 'previous') {
                                            currentPage--;
                                            if (currentPage < 0) currentPage = pages.length - 1;
                                        } else if (buttonInteraction.customId === 'next') {
                                            currentPage++;
                                            if (currentPage >= pages.length) currentPage = 0;
                                        }
                                    
                                        previousButton.setDisabled(currentPage === 0); // Atualiza o estado de desabilitado do botão "Página Anterior"
                                        nextButton.setDisabled(currentPage === pages.length - 1); // Atualiza o estado de desabilitado do botão "Próxima Página"
                                    
                                        buttonInteraction.update({ embeds: [pages[currentPage]], components: [buttonRow] });
                                    });

									collector.on('end', () => {
										buttonRow.components.forEach(component => component.setDisabled(true));
										message.edit({ components: [buttonRow] });
									});
								});
						})
						.catch((error) => {
							console.error('Erro ao criar as mensagens incorporadas:', error);
							interaction.reply('Ocorreu um erro ao criar as mensagens.');
						});
				} else {
					console.log('Personagem não encontrado');
					interaction.reply('Personagem não encontrado.');
				}
			})
			.catch((error) => {
				console.error('Erro ao buscar o personagem:', error);
				interaction.reply('Ocorreu um erro ao buscar o personagem.');
			});
	}
};