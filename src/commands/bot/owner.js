const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    client.embed({
        title: `📘・Owner information`,
        desc: `____________________________`,
        thumbnail: client.user.avatarURL({ dynamic: true, size: 1024 }),
        fields: [        {
            name: "👑┆Owner name",
            value: `Joel`,
            inline: true,
        },
        {
            name: "🏷┆Discord ID",
            value: `<@${process.env.DISCORD_ID}>`,
            inline: true,
        },
        {
            name: "🏢┆Organization",
            value: `Joel's Bot`,
            inline: true,
        },
        {
            name: "🌐┆Bot Status",
            value: `Online and Running!`,
            inline: true,
        }],
        type: 'editreply'
    }, interaction)
}

 