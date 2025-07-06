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
        .setDescription('Shows bot owner info'),
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows available commands'),
    new SlashCommandBuilder()
        .setName('info')
        .setDescription('Shows bot information'),
    new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Shows user avatar')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to get avatar of')
                .setRequired(false))
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
    } else if (commandName === 'help') {
        await interaction.reply({
            embeds: [{
                title: '📚 Available Commands',
                description: 'Here are the commands you can use:',
                fields: [
                    { name: '/ping', value: 'Test bot response', inline: true },
                    { name: '/hello', value: 'Get a greeting', inline: true },
                    { name: '/owner', value: 'Show bot owner info', inline: true },
                    { name: '/help', value: 'Show this help menu', inline: true },
                    { name: '/info', value: 'Show bot information', inline: true },
                    { name: '/avatar', value: 'Show user avatar', inline: true }
                ],
                color: 0x5865F2,
                footer: { text: 'Bot by jorl_carspotz' }
            }]
        });
    } else if (commandName === 'info') {
        await interaction.reply({
            embeds: [{
                title: '🤖 Bot Information',
                fields: [
                    { name: 'Bot Name', value: 'Test192727', inline: true },
                    { name: 'Owner', value: 'jorl_carspotz', inline: true },
                    { name: 'Servers', value: client.guilds.cache.size.toString(), inline: true },
                    { name: 'Users', value: client.users.cache.size.toString(), inline: true },
                    { name: 'Uptime', value: `${Math.floor(client.uptime / 60000)} minutes`, inline: true },
                    { name: 'Version', value: '1.0.0', inline: true }
                ],
                color: 0x5865F2,
                timestamp: new Date()
            }]
        });
    } else if (commandName === 'avatar') {
        const user = interaction.options.getUser('user') || interaction.user;
        await interaction.reply({
            embeds: [{
                title: `${user.username}'s Avatar`,
                image: { url: user.displayAvatarURL({ dynamic: true, size: 1024 }) },
                color: 0x5865F2
            }]
        });
    }
});

client.on('error', console.error);

client.login(process.env.DISCORD_TOKEN);