const { RichEmbed } = require("discord.js");
const {stripIndents} = require("common-tags");

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "purge",
  category: "Moderation",
  description: "Clears a entire Channel up to 2 weeks",
  usage: ""
};

exports.run = async (client, message, args) => {
    if (message.member.hasPermission("MANAGE_MESSAGES")) {
      message.channel.messages.fetch({ limit: 100 })
            .then(function(list){
                message.channel.bulkDelete(list);

                let embed = client.embed({
                  description: `Purge`,
                  timestamp: new Date(),
                  author: `Purged Up To 100 Messages`,
                  footer: `${client.config.footer} | Purge`,
                  color: `#4bf542`
              })

                message.channel.send(embed);
            }, function(err){message.channel.send(`ERROR: ERROR CLEARING CHANNEL. ${err}`)})                        
    }
}
