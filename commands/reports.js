const { Client, RichEmbed } = require(`discord.js`);
const Utils = require(`../modules/utils`)

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
    if (!args[0]) return message.channel.send(client.embed({preset: `error`, description: `Please mention a user's ID`}))


    client.dbFile.reportsEmbed(client, message, args);
};
