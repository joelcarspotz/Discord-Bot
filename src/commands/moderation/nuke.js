const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    // Check if user is authorized to use this command
    if (interaction.user.id !== '791076850222235657') {
        return interaction.reply('no');
    }

    const perms = await client.checkPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageChannels],
        perms: [Discord.PermissionsBitField.Flags.ManageChannels]
    }, interaction);

    if (perms == false) return;

    interaction.channel.clone().then((channel) => {
        channel.setPosition(interaction.channel.position).then(
            interaction.channel.delete()
        );

        client.embed({
            title: `Channel Nuked by **${interaction.user.tag}**`,
            image: `https://i.imgur.com/Da7ScU4.gif`
        }, channel)
    })
}

 