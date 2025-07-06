const Discord = require('discord.js');
const voiceSchema = require("../../database/models/voice");
const channelSchema = require("../../database/models/voiceChannels");

module.exports = async (client, oldState, newState) => {
    if (oldState.channelId == newState.channelId) {
        if (oldState.serverDeaf == false && newState.selfDeaf == true) return;
        if (oldState.serverDeaf == true && newState.selfDeaf == false) return;
        if (oldState.serverMute == false && newState.serverMute == true) return;
        if (oldState.serverMute == true && newState.serverMute == false) return;
        if (oldState.selfDeaf == false && newState.selfDeaf == true) return;
        if (oldState.selfDeaf == true && newState.selfDeaf == false) return;
        if (oldState.selfMute == false && newState.selfMute == true) return;
        if (oldState.selfMute == true && newState.selfMute == false) return;
        if (oldState.selfVideo == false && newState.selfVideo == true) return;
        if (oldState.selfVideo == true && newState.selfVideo == false) return;
        if (oldState.streaming == false && newState.streaming == true) return;
        if (oldState.streaming == true && newState.streaming == false) return;
    }

    var guildID = newState.guild.id || oldState.guild.id;

    try {
        const data = await voiceSchema.findOne({ Guild: guildID });
        if (data) {
            // Handle old channel cleanup
            try {
                const data2 = await channelSchema.findOne({ Guild: guildID, Channel: oldState.channelId });
                if (data2) {
                    let channel = client.channels.cache.get(data2.Channel);
                    if (channel) {
                        let memberCount = channel.members.size;
                        if (memberCount < 1 || memberCount == 0) {
                            if (data.ChannelCount) {
                                data.ChannelCount -= 1;
                                await data.save().catch(() => {});
                            }
                            await channelSchema.deleteOne({ Channel: oldState.channelId });
                            await oldState.channel?.delete().catch(() => {});
                        }
                    }
                }
            } catch (error) {
                console.error("Error in voice channel cleanup:", error);
            }

            // Handle new channel creation
            try {
                if (newState.channel && newState.channel.id === data.Channel) {
                    const user = await client.users.fetch(newState.id);
                    const member = newState.guild.members.cache.get(user.id);

                    if (data.ChannelCount) {
                        data.ChannelCount += 1;
                        await data.save();
                    } else {
                        data.ChannelCount = 1;
                        await data.save();
                    }

                    let channelName = data.ChannelName;
                    channelName = channelName.replace(`{emoji}`, "🔊");
                    channelName = channelName.replace(`{channel name}`, `Voice ${data.ChannelCount}`);
                    channelName = channelName.replace(`{channel count}`, `${data.ChannelCount}`);
                    channelName = channelName.replace(`{member}`, `${user.username}`);
                    channelName = channelName.replace(`{member tag}`, `${user.tag}`);

                    const channel = await newState.guild.channels.create({
                        name: "⌛",
                        type: Discord.ChannelType.GuildVoice,
                        parent: data.Category,
                    });

                    if (member.voice.setChannel(channel)) {
                        await channel.edit({ name: channelName });
                    }

                    await new channelSchema({
                        Guild: guildID,
                        Channel: channel.id,
                    }).save();
                }
            } catch (error) {
                console.error("Error in voice channel creation:", error);
            }
        }
    } catch (error) {
        console.error("Error in voiceStateUpdate:", error);
    }
}