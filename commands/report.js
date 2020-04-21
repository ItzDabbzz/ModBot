const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const Utils = require('../modules/utils');
const vars = Utils.Variables;
const Embed = Utils.Embed;
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "report",
  category: "Moderation",
  description: "Reports a user",
  usage: "<id | mention> <reason>"
};

const id = Math.floor(Math.random() * 100000)

exports.run = async (client, message, args) => {
    if (message.deletable) message.delete();
    let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!rMember)
        return message.reply("Couldn't find that person?").then(m => m.delete({timeout:5000}));

    if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
        return message.channel.send("Can't report that member").then(m => m.delete({timeout:5000}));

    if (!args[1])
        return message.channel.send("Please provide a reason for the report").then(m => m.delete({timeout:5000}));
    
    const channel = message.guild.channels.cache.find(c => c.name === "reports")
    const reason = args.slice(1).join(" ");

    if (!channel)
        return message.channel.send("Couldn't find a `#reports` channel").then(m => m.delete({timeout: 5000}));

    const memid = message.member.id;

    let embed = Embed({
        color: `#ff0000`,
        timestamp: new Date(),
        author: message.author,
        footer: `${client.config.footer} | ${message.guild.name}`,
        description: `**> Member:** ${rMember} (${rMember.user.id})
        **> Reported by:** ${message.member}
        **> Reported in:** ${message.channel}
        **> Reason:** ${reason}`
    })
    vars.database.punishments.addReport(id, rMember.user.id, memid, reason);
    Utils.Logger.log(`User Reported ${rMember.name} | ${memid}`);
    return channel.send(embed);
}