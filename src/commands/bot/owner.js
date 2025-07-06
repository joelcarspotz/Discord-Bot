const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    client.embed({
        title: `📘・Owner information`,
        desc: `____________________________`,
        thumbnail: client.user.avatarURL({ dynamic: true, size: 1024 }),
        fields: [{
            name: "👑┆Owner name",
            value: `jorl_carspotz`,
            inline: true,
        },
        {
            name: "🏷┆Discord tag",
            value: `<@791076850222235657>`,
            inline: true,
        },
        {
            name: "�┆Owner ID",
            value: `791076850222235657`,
            inline: true,
        },
        {
            name: "🤖┆Status",
            value: `Bot Owner & Developer`,
            inline: true,
        }],
        type: 'editreply'
    }, interaction)
}

 