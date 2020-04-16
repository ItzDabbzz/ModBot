const Utils = require(`../utils`);
const Embed = Utils.Embed;
const vars = Utils.Variables;

module.exports.sendReport = async (message, user, reason, modLogs, id) => {
    let embed = Embed({
        title:"Report",
        description: `Guild name: ${message.guild.name}`,
        color: vars.client.config.embedRed,
        footer: `${vars.client.config.footer} | ID: ${id}`,
        fields: [
        {
            name: 'User:',
            value: `${user} (${user.id})`
        },
        {
            name: 'Action by:',
            value: `${message.author} (${message.author.id})`
        },
        {
            name: 'Reason:',
            value: reason
        }
        ]
    })
    let reportsChannel = message.guild.channels.cache.find(c => c.name === `reports`);
    if (!reportsChannel) return await errors.couldNotLog(message, modLogs);
    if (!reportsChannel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await reportsChannel.send([
            "Report",
            `Guild name: ${message.guild.name}`,
            `**User:**\n${user} (${user.id})`,
            `**Action by:**\n ${message.author} (${message.author.id})`,
            `**Reason:**\n ${reason}`,
            `ID:\n${id}\n**R6Bot**`
        ].join("\n")).catch(async err => {
            await errors.couldNotLog(message, modLogs);
        }) 
    };
    await reportsChannel.send(embed)
        .catch(async () => {
            await errors.couldNotLog(message, modLogs);
        });
    await user.send(embed)
        .catch(async () => {
            await errors.couldNotDM(message);
        });
}