const { RichEmbed } = require("discord.js");

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["bc", "broadcast"],
  permLevel: "User"
};

exports.help = {
  name: "say",
  category: "Administrator",
  description: "Make the bot say something",
  usage: "<Input>"
};


exports.run = (client, message, args) => {
    message.delete();

    if (!message.member.hasPermission("MANAGE_MESSAGES"))
        return message.reply("You don't have the required permissions to use this command.").then(m => m.delete(5000));

    if (args.length < 0)
        return message.reply("Nothing to say?").then(m => m.delete(5000));

    const roleColor = message.guild.roles.highest.hexColor;

    if (args[0].toLowerCase() === "embed") {
        /*const embed = new RichEmbed()
            .setDescription(args.slice(1).join(" "))
            .setColor(roleColor === "#000000" ? "#ffffff" : roleColorv);*/

            let embed = client.embed({
                description: args.slice(1).join(" "),
                color: roleColor === "#000000" ? "#ffffff" : roleColorv,
                footer: `${client.config.footer} | Message By: ${message.member.author}`
            })

        message.channel.send(embed);
    } else {
        message.channel.send(args.join(" "));
    }
}