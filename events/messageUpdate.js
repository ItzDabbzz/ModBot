const Utils = require(`../modules/utils`);
const Embed = Utils.Embed;
// messageUpdate
/* Emitted whenever a message is updated - e.g. embed or content change.
PARAMETER     TYPE           DESCRIPTION
oldMessage    Message        The message before the update
newMessage    Message        The message after the update    */
module.exports = async (client, oldMessage, newMessage) => {
    //if (newMessage.author.bot) return;
    if (!newMessage.guild) return;
    if (!oldMessage.guild) return;
    const channel = newMessage.guild.channels.cache.find(channel => channel.name === "mod-logs")
    if (!channel) return;
    if (oldMessage.content === newMessage.content) return;


    let embed = Embed({
        title: 'Message Edited',
        description: `[Go To Message](${newMessage.url})`,
        footer: client.config.footer,
        color: `#EE82EE`,
        fields: [{
            name: 'Original Message',
            value: (oldMessage.content.length <= 1024) ? oldMessage.content : `${oldMessage.content.substring(0, 1020)}...`
            //
        },
        {
            name: 'Edited Message',
            value: (newMessage.content.length <= 1024) ? newMessage.content : `${newMessage.content.substring(0, 1020)}...`
            //
        },
        {
            name: 'Channel',
            value: newMessage.channel
        },
        {
            name: `Message Author`,
            value: `${newMessage.author}`
        },
        {
            name: 'Number of Edits',
            value: newMessage.edits.length
        }],
        timestamp: new Date(),
        thumbnail: `${newMessage.author.avatarURL({format:`png`, dynamic:true})}`,
        author: { name: newMessage.author.tag, icon: newMessage.author.avatarURL({format:`png`, dynamic:true}) },
    })

    channel.send(embed);
}