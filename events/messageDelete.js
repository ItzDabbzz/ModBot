const {Client, RichEmbed} = require("discord.js");
// messageDelete
/* Emitted whenever a message is deleted.
PARAMETER      TYPE           DESCRIPTION
message        Message        The deleted message    */
module.exports = async (message) => {
    /*const channel1 = message.guild.channels.find(channel => channel.name === "mod-logs")
    const embed = new RichEmbed();
    embed.setTitle('Message Deleted');
    embed.setURL(message.url);
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL);
    embed.setThumbnail(message.author.displayAvatarURL);
    embed.addField('Deleted Text', (message.content.length <= 1024) ? message.content : `${message.content.substring(0, 1020)}...`, true);
    embed.addField('Channel', message.channel, true);
    embed.addField('Message Author', `${message.author} (${message.author.tag})`, true);
    (message.author) ? (message.author !== message.author) ? embed.addField('Deleted By', message.author, true): '' : '';
    (message.mentions.users.size === 0) ? embed.addField('Mentioned Users', 'None', true): embed.addField('Mentioned Users', `Mentioned Member Count: ${message.mentions.users.array().length} \n Mentioned Users List: \n ${message.mentions.users.array()}`, true);
    embed.setTimestamp();
    channel1.send(embed);*/
}