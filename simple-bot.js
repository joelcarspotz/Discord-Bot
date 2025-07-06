const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

// Simple commands
const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Says hello!'),
    new SlashCommandBuilder()
        .setName('owner')
        .setDescription('Shows bot owner info')
];

client.once('ready', async () => {
    console.log(`✅ Bot is online as ${client.user.tag}!`);
    
    // Register slash commands
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    try {
        console.log('Started refreshing application (/) commands.');
        
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands.map(command => command.toJSON()) },
        );
        
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('🏓 Pong!');
    } else if (commandName === 'hello') {
        await interaction.reply(`👋 Hello ${interaction.user.username}!`);
    } else if (commandName === 'owner') {
        await interaction.reply({
            embeds: [{
                title: '👑 Bot Owner Information',
                fields: [
                    { name: 'Owner', value: 'jorl_carspotz', inline: true },
                    { name: 'Discord ID', value: '791076850222235657', inline: true },
                    { name: 'Status', value: 'Bot Owner & Developer', inline: false }
                ],
                color: 0x5865F2
            }]
        });
    }
});

client.on('error', console.error);

client.login(process.env.DISCORD_TOKEN);