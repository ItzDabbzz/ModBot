const Utils = require('../modules/utils');
const Embed = Utils.Embed;

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "invitetop",
  category: "Miscellaneous",
  description: "Shows latency and API Ping.",
  usage: ""
};
  
exports.run = async (client, message, args) => {
  const guildInvites = await message.guild.fetchInvites();

  const users = [];
  if (guildInvites.size < 1) return message.channel.send(Embed({ title: `Invites Top`, description: `There are no invites` }));
  guildInvites.forEach(invite => {
      if (!message.guild.member(invite.inviter.id)) return;
      const user = users.find(u => u.id == invite.inviter.id);
      if (!user) {
          users.push({
              id: invite.inviter.id,
              invites: invite.uses
          })
      } else {
          user.invites += invite.uses;
      }
  })
  const topUsers = users.sort((a, b) => b.invites - a.invites).splice(0, 10);
  await message.channel.send(Embed({ title: `Invites Top`, description: topUsers.map(u => `<@${u.id}> - \`\`${u.invites} invite${u.invites == 1 ? '' : 's'}\`\``).join('\n'), footer: `Total: ${guildInvites.map(i => i.uses).reduce((acc, curr) => acc + curr)}` }));

}
