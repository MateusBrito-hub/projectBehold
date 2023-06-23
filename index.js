const { Client, GatewayIntentBits, Collection } = require('discord.js')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();
const { TOKEN, MONGODB_URI } = process.env

// Conecta-se ao banco de dados
mongoose.Promise = global.Promise
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso')
}).catch((error) => {
    console.error('Erro ao conectar-se ao banco de dados:', error)
});

// Importação dos comandos
const fs = require('fs')
const path = require('path')
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'))

const client = new Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ]})
client.commands = new Collection()

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command)
    } else {
        console.log(`Esse comando em ${filePath} está com "data" ou "execute" ausentes`)
    }
}

client.once('ready', (c) => {
    console.log(`Pronto! Login realizado como ${c.user.tag}`)
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.error('Comando não encontrado')
        return
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply('Houve um erro ao executar esse comando!')
    }
})

client.login(TOKEN)