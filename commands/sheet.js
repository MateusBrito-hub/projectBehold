const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Sheet = require('../models/sheet.js');
const char = {};
const fichas = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ficha")
        .setDescription("Comando para criar ficha")
        .addStringOption(option => option.setName('char').setDescription('Informe o Personagem desejado'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Adicione as informações básicas da ficha')
                .addStringOption(option => option.setName('personagem').setDescription('informe a url da Imagem').setRequired(true))
                .addStringOption(option => option.setName('nome').setDescription('informe o nome do personagem').setRequired(true))
                .addStringOption(option => option.setName('classe').setDescription('informe a sua classe/nível').setRequired(true))
                .addStringOption(option => option.setName('antecedente').setDescription('informe o seu antecedente').setRequired(true))
                .addStringOption(option => option.setName('raça').setDescription('informe a sua raça').setRequired(true))
                .addStringOption(option => option.setName('alinhamento').setDescription('informe o seu alinhamento').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Informe os Status do seu personagem')
                .addStringOption(option => option.setName('for').setDescription('informe o valor de força').setRequired(true))
                .addStringOption(option => option.setName('des').setDescription('informe o valor de destreza').setRequired(true))
                .addStringOption(option => option.setName('con').setDescription('informe o valor de constituição').setRequired(true))
                .addStringOption(option => option.setName('int').setDescription('informe o valor de inteligência').setRequired(true))
                .addStringOption(option => option.setName('sab').setDescription('informe o valor de sabedoria').setRequired(true))
                .addStringOption(option => option.setName('car').setDescription('informe o valor de carisma').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('skills')
                .setDescription('Informe as Salvaguardas do seu personagem')
                .addStringOption(option => option.setName('prof').setDescription('informe suas proficiencias separadas por /').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('criar')
                .setDescription('Finaliza a criação de ficha')
        ),

    async execute(interaction) {
        function saveProficiency(charClass) {
            let savingThrowsPro = {};

            switch (charClass.toLowerCase()) {
                case 'bárbaro':
                case 'barbarian':
                case 'guerreiro':
                case 'fighter':
                    savingThrowsPro = { stStr: true, stDex: false, stCon: true, stInt: false, stWis: false, stCha: false };
                    break;
                case 'bardo':
                case 'bard':
                    savingThrowsPro = { stStr: false, stDex: true, stCon: false, stInt: false, stWis: false, stCha: true };
                    break;
                case 'bruxo':
                case 'warlock':
                case 'clérigo':
                case 'cleric':
                case 'paladino':
                case 'paladin':
                    savingThrowsPro = { stStr: false, stDex: false, stCon: false, stInt: false, stWis: true, stCha: true };
                    break;
                case 'druida':
                case 'druid':
                case 'mago':
                case 'wizard':
                    savingThrowsPro = { stStr: false, stDex: false, stCon: false, stInt: true, stWis: true, stCha: false };
                    break;
                case 'feiticeiro':
                case 'sorcerer':
                    savingThrowsPro = { stStr: false, stDex: false, stCon: true, stInt: false, stWis: false, stCha: true };
                    break;
                case 'ladino':
                case 'rogue':
                    savingThrowsPro = { stStr: false, stDex: true, stCon: false, stInt: true, stWis: false, stCha: false };
                    break;
                case 'monge':
                case 'monk':
                case 'patrulheiro':
                case 'ranger':
                    savingThrowsPro = { stStr: true, stDex: true, stCon: false, stInt: false, stWis: false, stCha: false };
                    break;
                default:
                    break;
            }
            return savingThrowsPro;
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
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id; // Obtém o ID do usuário que está fazendo a requisição
        if (!subcommand) {
            console.log(interaction.options.getString('char'))
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
            async function createSheetInfoEmbed(sheetInfo) {
                const charImageUrl = char.sheet.charImg
                const embed1 = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setImage(charImageUrl)
                    .setTitle('Ficha de Personagem')
                    .addFields(
                        { name: 'Nome:', value: `${sheetInfo.charName}`, inline: true },
                        { name: 'Classe:', value: `${sheetInfo.charClass}`, inline: true },
                        { name: 'Raça:', value: `${sheetInfo.charRace}`, inline: true },
                        { name: 'Antecendente:', value: `${sheetInfo.backgroundChar}`, inline: true },
                        { name: 'Alinhamento:', value: `${sheetInfo.alignment}`, inline: true },
                    )
                    .setFooter({ text: 'Página 1/4' });
                return embed1;
            }
            async function createStatusValueEmbed(statusValue) {
                const charImageUrl = char.sheet.charImg
                const embed2 = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('Ficha de Personagem')
                    .setImage(charImageUrl)
                    .addFields(
                        { name: 'For:', value: `${statusValue.str} (${attributeModifier(statusValue.str)})`, inline: true },
                        { name: 'Des:', value: `${statusValue.dex} (${attributeModifier(statusValue.dex)})`, inline: true },
                        { name: 'Con:', value: `${statusValue.con} (${attributeModifier(statusValue.con)})`, inline: true },
                        { name: 'Int:', value: `${statusValue.int} (${attributeModifier(statusValue.int)})`, inline: true },
                        { name: 'Sab:', value: `${statusValue.wis} (${attributeModifier(statusValue.wis)})`, inline: true },
                        { name: 'Car:', value: `${statusValue.cha} (${attributeModifier(statusValue.cha)})`, inline: true },
                    )
                    .setFooter({ text: 'Página 2/4' });
                return embed2;
            }
            async function createStatusThrowsEmbed(savingThrows) {
                const charImageUrl = char.sheet.charImg
                const embed3 = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('Saving Throws')
                    .setImage(charImageUrl)
                    .addFields(
                        { name: 'For:', value: `${savingThrows.stStr}`, inline: true },
                        { name: 'Des:', value: `${savingThrows.stDex}`, inline: true },
                        { name: 'Con:', value: `${savingThrows.stCon}`, inline: true },
                        { name: 'Int:', value: `${savingThrows.stInt}`, inline: true },
                        { name: 'Sab:', value: `${savingThrows.stWis}`, inline: true },
                        { name: 'Car:', value: `${savingThrows.stCha}`, inline: true },
                    )
                    .setFooter({ text: 'Página 3/4' });
                return embed3;
            }
            async function createCharSkillsEmbed(charSkills) {
                //const charImageUrl = char.sheet.charImg
                const embed4 = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('Skills')
                    .addFields(
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Acrobacia:', value: `${charSkills.acrobatics}`, inline: true },
                        { name: 'Adestra Animais:', value: `${charSkills.animalHandling}`, inline: true },
                        { name: 'Arcanismo:', value: `${charSkills.arcana}`, inline: true },
                        { name: 'Atletismo:', value: `${charSkills.athletics}`, inline: true },
                        { name: 'Atuação:', value: `${charSkills.performance}`, inline: true },
                        { name: 'Enganação:', value: `${charSkills.deception}`, inline: true },
                        { name: 'Furtividade:', value: `${charSkills.stealth}`, inline: true },
                        { name: 'Historia:', value: `${charSkills.history}`, inline: true },
                        { name: 'Intuição:', value: `${charSkills.insight}`, inline: true },
                        { name: 'Intimidação:', value: `${charSkills.intimidation}`, inline: true },
                        { name: 'Investigação:', value: `${charSkills.investigation}`, inline: true },
                        { name: 'Medicina:', value: `${charSkills.medicine}`, inline: true },
                        { name: 'Natureza:', value: `${charSkills.nature}`, inline: true },
                        { name: 'Percepção:', value: `${charSkills.perception}`, inline: true },
                        { name: 'Persuasão:', value: `${charSkills.persuasion}`, inline: true },
                        { name: 'Prestidigitação:', value: `${charSkills.sleightofHand}`, inline: true },
                        { name: 'Religião:', value: `${charSkills.religion}`, inline: true },
                        { name: 'Sobrevivencia:', value: `${charSkills.survival}`, inline: true },
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Percepção Passiva:', value: `${10 + charSkills.passiveWisdom}` },
                    )
                    .setFooter({ text: 'Página 4/4' });
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
        if (subcommand === 'info') {
            const ficha = fichas.get(userId);
            // Verifica se a ficha já existe para esse usuário
            if (ficha) {
                await interaction.reply('Você já iniciou a criação da ficha. Por favor, conclua ou cancele a ficha em andamento antes de iniciar uma nova.');
                return;
            }
            const basicInfo = {
                // Obtém as informações básicas da requisição
                charImg: interaction.options.getString('personagem'),
                charName: interaction.options.getString('nome'),
                charClass: interaction.options.getString('classe'),
                charRace: interaction.options.getString('raça'),
                backgroundChar: interaction.options.getString('antecedente'),
                alignment: interaction.options.getString('alinhamento')
            };
            fichas.set(userId, { basicInfo });
            await interaction.reply('Informações básicas coletadas com sucesso!');
        }
        if (subcommand === 'status') {
            const ficha = fichas.get(userId);
            // Verifica se a ficha existe para esse usuário
            if (!ficha) {
                await interaction.reply('Você ainda não iniciou a criação da ficha. Por favor, inicie a criação da ficha utilizando o comando /ficha info.');
                return;
            }
            const statusValue = {
                str: parseInt(interaction.options.getString('for')),
                dex: parseInt(interaction.options.getString('des')),
                con: parseInt(interaction.options.getString('con')),
                int: parseInt(interaction.options.getString('int')),
                wis: parseInt(interaction.options.getString('sab')),
                cha: parseInt(interaction.options.getString('car')),
            };
            const savingThrows = {
                value: {
                    stStr: attributeModifier(statusValue.str),
                    stDex: attributeModifier(statusValue.dex),
                    stCon: attributeModifier(statusValue.con),
                    stInt: attributeModifier(statusValue.int),
                    stWis: attributeModifier(statusValue.wis),
                    stCha: attributeModifier(statusValue.cha),
                },
                prof: saveProficiency(ficha.basicInfo.charClass)
            }
            for (const key in savingThrows.value) {
                if (savingThrows.prof[key] === true) {
                    savingThrows.value[key] = savingThrows.value[key] + 2;
                }
            }
            ficha.statusValue = statusValue;
            ficha.savingThrows = savingThrows;
            fichas.set(userId, ficha)
            await interaction.reply('Valores dos Atributos coletados com sucesso!');
        }
        if (subcommand === 'skills') {
            const ficha = fichas.get(userId);
            const statusValue = ficha.statusValue
            // Verifica se a ficha existe para esse usuário
            if (!ficha) {
                await interaction.reply('Você ainda não iniciou a criação da ficha. Por favor, inicie a criação da ficha utilizando o comando /ficha info.');
                return;
            }
            const charSkills = {
                value: {
                    acrobatics: attributeModifier(statusValue.dex),
                    animalHandling: attributeModifier(statusValue.wis),
                    arcana: attributeModifier(statusValue.int),
                    athletics: attributeModifier(statusValue.str),
                    deception: attributeModifier(statusValue.cha),
                    history: attributeModifier(statusValue.int),
                    insight: attributeModifier(statusValue.wis),
                    intimidation: attributeModifier(statusValue.cha),
                    investigation: attributeModifier(statusValue.int),
                    medicine: attributeModifier(statusValue.cha),
                    nature: attributeModifier(statusValue.int),
                    perception: attributeModifier(statusValue.wis),
                    performance: attributeModifier(statusValue.cha),
                    persuasion: attributeModifier(statusValue.cha),
                    religion: attributeModifier(statusValue.int),
                    sleightofHand: attributeModifier(statusValue.dex),
                    stealth: attributeModifier(statusValue.dex),
                    survival: attributeModifier(statusValue.wis),
                    passiveWisdom: attributeModifier(statusValue.wis)
                }
            }
            const skill = interaction.options.getString('prof')
            const slicer = skill.toLowerCase().split('/')
            if (charSkills.prof === undefined) {
                charSkills.prof = {};
            }
            for (const key of slicer) {
                charSkills.prof[key] = true
            }
            for (const key in charSkills.value) {
                if (charSkills.prof[key] === true) {
                    charSkills.value[key] = charSkills.value[key] + 2;
                }
            }
            ficha.charSkills = charSkills;
            fichas.set(userId, ficha)
            await interaction.reply('Valores dos Atributos coletados com sucesso!')
        }
        if (subcommand === 'criar') {
            const ficha = fichas.get(userId);
            // Verifica se a ficha existe para esse usuário
            if (!ficha) {
                await interaction.reply('Você ainda não iniciou a criação da ficha. Por favor, inicie a criação da ficha utilizando o comando /ficha info.');
                return;
            }
            const sheetData = {
                playerName: interaction.user.username,
                charImg: ficha.basicInfo.charImg,
                sheetInfo: ficha.basicInfo,
                statusValue: ficha.statusValue,
                savingThrows: ficha.savingThrows,
                charSkills: ficha.charSkills,
            };
            const newSheet = new Sheet(sheetData);
            await newSheet.save();
            fichas.delete(userId); // Remove a ficha da estrutura de dados após a criação
            await interaction.reply('Ficha criada com sucesso!');
        }
    },
};