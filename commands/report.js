const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

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

exports.run = async (client, message, args) => {
    if (message.deletable) message.delete();
    const modLogs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run();
    let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!rMember)
        return message.reply("Couldn't find that person?").then(m => m.delete({timeout:5000}));

    if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
        return message.channel.send("Can't report that member").then(m => m.delete({timeout:5000}));

    if (!args[1])
        return message.channel.send("Please provide a reason for the report").then(m => m.delete({timeout:5000}));
    
    const channel = message.guild.channels.cache.find(c => c.name === "reports")
    const user = message.mentions.members.first() || message.guild.members.get(args[0]);
    const reason = args.slice(1).join(" ");

    if (!channel)
        return message.channel.send("Couldn't find a `#reports` channel").then(m => m.delete({timeout: 5000}));

    /*const embed = new RichEmbed()
        .setColor("#ff0000")
        .setTimestamp(Date.now())
        .setFooter(`${client.config.footer} | ${message.guild.name}`, message.guild.iconURL)
        .setAuthor("Reported member", rMember.user.displayAvatarURL)
        .setDescription(stripIndents`**> Member:** ${rMember} (${rMember.user.id})
        **> Reported by:** ${message.member}
        **> Reported in:** ${message.channel}
        **> Reason:** ${reason}`);*/

    let embed = client.embed({
        color: `#ff0000`,
        timestamp: new Date(),
        author: message.author,
        footer: `${client.config.footer} | ${message.guild.name}`,
        description: `**> Member:** ${rMember} (${rMember.user.id})
        **> Reported by:** ${message.member}
        **> Reported in:** ${message.channel}
        **> Reason:** ${reason}`
    })

    client.db.createReport(client, message, user, reason, modLogs);
    client.logger.log(`User Reported ${rMember}`);

    return message.channel.send(embed);
}