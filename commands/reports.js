const { Client, RichEmbed } = require(`discord.js`);
const Utils = require(`../modules/utils`)
const vars = Utils.Variables;

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["reports"],
  permLevel: "Moderator"
};

exports.help = {
  name: "viewreports",
  category: "Moderation",
  description: "Views a user's Punishment History",
  usage: "<id>"
};

exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send(Utils.Embed({preset: `error`, description: `Please mention a user's ID`}))


    vars.database.punishments.reportsEmbed(client, message, args);
};
