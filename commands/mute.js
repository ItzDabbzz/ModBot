  const Utils = require('../modules/utils')
  const fs = require(`fs`)
  const Embed = Utils.Embed;
  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Moderator"
  };
  
  exports.help = {
    name: "mute",
    category: "Moderation",
    description: "Shows latency and API Ping.",
    usage: ""
  };
  
exports.run = async (client, message, args) => {
  const toMute = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!toMute) return message.channel.send(Embed({preset:`error`, description: `You did not specify a user mention or ID!`}));
  if (toMute.id === message.author.id) return message.channel.send(Embed({preset:`error`, description: `You can not mute yourself!`}));
  if (toMute.roles.position >= message.member.roles.highest.position) return message.channel.send(Embed({preset:`error`, description: `You can not mute a member that is equal to or higher than yourself!`}));

  const mutedRole = message.guild.roles.cache.find(role => role.name == `Muted`);

    // If the mentioned user does not have the muted role execute the following
  if(!mutedRole){
    try{
      //Create Muted Role
      mutedRole = await message.guild.roles.create({
        data: {
          name: `Muted`,
          color: `BLACK`
        },
        reason: "Role to provide Muting members of the guild."
      });

      // Prevent the user from sending messages or reacting to messages
      message.guild.channels.forEach(async (channel, id) => {
        await channel.updateOverwrite(mutedRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });

    } catch(e){
      Utils.Logger.log(e, "error")
    }
  }

  Utils.Logger.log(`${toMute}`)

  // If the mentioned user already has the "mutedRole" then that can not be muted again
  if (toMute.roles.cache.has(mutedRole)) message.channel.send(Embed({preset:`error`, description: `This user has already been muted!`}));

    // Check current time and add muted time to it, then convert to seconds from milliseconds
    client.muted[toMute.id] = {
      guild: message.guild.id,
      time: Date.now() + parseInt(args[1]) * 1000
    };
  
    // Add the mentioned user to the "mutedRole" and notify command sender
    await toMute.roles.add(mutedRole);
  
    fs.writeFile('./data/muted.json', JSON.stringify(client.muted, null, 4), err => {
      if (err) throw err;
      Utils.Logger.log(err, "error")
      message.channel.send(Embed({preset:`ready`, description: `I have muted ${toMute.user.tag}`}));
    });
  

}
