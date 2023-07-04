const { SlashCommandBuilder } = require("discord.js");
const Sheet = require('../models/sheet.js');
const fichas = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ficha")
        .setDescription("Comando para criar ficha")
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
                .setName('charskill')
                .setDescription('Informe as Salvaguardas do seu personagem')
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
                    savingThrowsPro = { stStrPro: true, stDexPro: false, stConPro: true, stIntPro: false, stWisPro: false, stChaPro: false };
                    break;

                case 'bardo':
                case 'bard':
                    savingThrowsPro = { stStrPro: false, stDexPro: true, stConPro: false, stIntPro: false, stWisPro: false, stChaPro: true };
                    break;

                case 'bruxo':
                case 'warlock':
                case 'clérigo':
                case 'cleric':
                case 'paladino':
                case 'paladin':
                    savingThrowsPro = { stStrPro: false, stDexPro: false, stConPro: false, stIntPro: false, stWisPro: true, stChaPro: true };
                    break;

                case 'druida':
                case 'druid':
                case 'mago':
                case 'wizard':
                    savingThrowsPro = { stStrPro: false, stDexPro: false, stConPro: false, stIntPro: true, stWisPro: true, stChaPro: false };
                    break;

                case 'feiticeiro':
                case 'sorcerer':
                    savingThrowsPro = { stStrPro: false, stDexPro: false, stConPro: true, stIntPro: false, stWisPro: false, stChaPro: true };
                    break;

                case 'ladino':
                case 'rogue':
                    savingThrowsPro = { stStrPro: false, stDexPro: true, stConPro: false, stIntPro: true, stWisPro: false, stChaPro: false };
                    break;

                case 'monge':
                case 'monk':
                case 'patrulheiro':
                case 'ranger':
                    savingThrowsPro = { stStrPro: true, stDexPro: true, stConPro: false, stIntPro: false, stWisPro: false, stChaPro: false };
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
                backgroundChar:interaction.options.getString('antecedente'),
                alignment: interaction.options.getString('alinhamento')
            };
            fichas.set(userId, { basicInfo });

            await interaction.reply('Informações básicas coletadas com sucesso!');
        }

        if (subcommand === 'status') {
            const ficha = fichas.get(userId);
            const savingThrowsPro = saveProficiency(ficha.basicInfo.charClass)
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
                stStr: attributeModifier(statusValue.str),
                stDex: attributeModifier(statusValue.dex),
                stCon: attributeModifier(statusValue.con),
                stInt: attributeModifier(statusValue.int),
                stWis: attributeModifier(statusValue.wis),
                stCha: attributeModifier(statusValue.cha),
            }

            for (const key in savingThrows) {
                if (savingThrowsPro[key] === true) {
                    savingThrows[key] = savingThrows[key] + 2;
                }
            }
            const charSkills = {
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

            ficha.statusValue =  statusValue;
            ficha.savingThrows = savingThrows;
            ficha.charSkills = charSkills;

            fichas.set(userId, ficha)

            await interaction.reply('Valores dos Atributos coletados com sucesso!');
        }

        if (subcommand === 'criar') {
            const ficha = fichas.get(userId);
            const saveThrowsPro = saveProficiency(ficha.basicInfo.charClass)

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
                savingThrowsPro: saveThrowsPro
            };

            console.log(sheetData)
            const newSheet = new Sheet(sheetData);
            await newSheet.save();

            fichas.delete(userId); // Remove a ficha da estrutura de dados após a criação

            await interaction.reply('Ficha criada com sucesso!');
        }
    },
};