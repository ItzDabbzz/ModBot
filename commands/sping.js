const { MessageEmbed } = require(`discord.js`)
const Utils = require('../modules/utils');

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Moderator"
  };
  
  exports.help = {
    name: "sping",
    category: "Miscellaneous",
    description: "Shows Ping & Latency Of Dabbzz's Servers",
    usage: ""
  };
  
  exports.run = async (client, message, args) => {
  const embed = new MessageEmbed().setTitle('**SERVER PING**');
  let description = "";
  function getServer(servertitle) {
      return new Promise((resolve, reject) => {
          const server = client.config.Servers[servertitle];
          const ip = server.split(":")[0];
          const port = server.split(":")[1] || '80';
          Utils.ping(ip, port, message)
              .then(ms => {
                  description += (ms > 500 ? ':warning:' : ':white_check_mark:') + ' **' + servertitle + '** ``' + ms + ' ms``\n';
                  resolve();
              })
              .catch(err => {
                  description += ':no_entry: **' + servertitle + '** ``OFFLINE``\n';
                  resolve();
              })
      })
  }

  Promise.all(Object.keys(client.config.Servers).map(title => getServer(title))).then(() => {
      message.channel.send(embed.setDescription(description));
  })


}
