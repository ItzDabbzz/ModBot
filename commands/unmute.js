const fs = require(`fs`);
const Utils = require('../modules/utils');
const Embed = Utils.Embed;

  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Moderator"
  };
  
  exports.help = {
    name: "unmute",
    category: "Moderation",
    description: "Unmutes a user.",
    usage: ""
  };
  
exports.run = async (client, message, args) => {
  // Check perms, self, rank, etc
  const toMute = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!toMute) return message.channel.send(Embed({preset:`error`, description: `You did not specify a user mention or ID!`}));
  if (toMute.id === message.author.id) return message.channel.send(Embed({preset:`error`, description: `You can not unmute yourself!`}));
  if (toMute.roles.position >= message.member.roles.highest.position) return message.channel.send(Embed({preset:`error`, description: `You can not unmute a member that is equal to or higher than yourself!`}));

  const mutedRole = message.guild.roles.cache.find(role => role.name == `Muted`);
  // Check if the user has the mutedRole

  // If the mentioned user or ID does not have the "mutedRole" return a message
  if (!mutedRole || !toMute.roles.cache.has(mutedRole.id)) return message.channel.send(Embed({preset:`error`, description: `This user is not muted!`}));

  // Remove the mentioned users role "mutedRole", "muted.json", and notify command sender
  await toMute.roles.remove(mutedRole);

  //member.roles.remove(mutedRole);
  delete client.muted[toMute.id];

  fs.writeFile('./data/muted.json', JSON.stringify(client.muted), err => {
    if (err) throw err;
    message.channel.send(`I have unmuted ${toMute.user}!`);
  });
}
