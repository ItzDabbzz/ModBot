const { Client, RichEmbed } = require(`discord.js`);
const Utils = require(`../modules/utils`)
const vars = Utils.Variables;

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["viewpunishments", "vp"],
  permLevel: "Moderator"
};

exports.help = {
  name: "punishments",
  category: "Moderation",
  description: "Views a User's Punishment History",
  usage: "<id>"
};

exports.run = async (client, message, args) => {

  if (!args[0]) return message.channel.send(Utils.Embed({preset: `error`, description: `Please mention a user's ID`}))

    vars.database.punishments.punishmentsEmbed(message, args);
};
