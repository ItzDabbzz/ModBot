const {Client, RichEmbed} = require("discord.js");
// messageUpdate
/* Emitted whenever a message is updated - e.g. embed or content change.
PARAMETER     TYPE           DESCRIPTION
oldMessage    Message        The message before the update
newMessage    Message        The message after the update    */
module.exports = async (oldMessage, newMessage) => {
    /*const channel = newMessage.guild.channels.cache.find(channel => channel.name === "mod-logs")
    if (!channel) return;
    if (oldMessage.content === newMessage.content) return;
    if (newMessage.author.bot) return;

    const embed = new RichEmbed()
    .setTitle('Message Edited')
    .setURL(newMessage.url)
    .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL)
    .setColor('#EE82EE')
    .setThumbnail(oldMessage.author.displayAvatarURL)
    .addField('Original Message', (oldMessage.content.length <= 1024) ? oldMessage.content : `${oldMessage.content.substring(0, 1020)}...`, true)
    .addField('Edited Message', (newMessage.content.length <= 1024) ? newMessage.content : `${newMessage.content.substring(0, 1020)}...`, true)
    .addField('Channel', oldMessage.channel, true)
    .addField('Message Author', `${oldMessage.author} (${oldMessage.author.tag})`, true)
    .addField('Number of Edits', newMessage.edits.length, true)
    .setTimestamp();

    channel.send(embed);*/
}