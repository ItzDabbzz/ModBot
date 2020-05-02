  const Utils = require('../modules/utils')
  const fs = require(`fs`)
  const Embed = Utils.Embed;
  const ms = require("ms");

  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Moderator"
  };
  
  exports.help = {
    name: "mute",
    category: "Moderation",
    description: "Mute a member for a period of time",
    usage: "<@user> 1d1h <reason>"
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
    message.guild.channels.cache.forEach(async (channel, id) => {
      await channel.updateOverwrite(mutedRole, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false,
        CONNECT: false,
        SPEAK: false,
      })
    });
    }catch(e){
      Utils.Logger.log(e, "error")
    }


  }
  //Regex pattern for detecting the time length for mute sentence.
  var patt = new RegExp("([1-9]+[d-h-s])")

  if(patt.test(args[1])){ 
    // If the mentioned user already has the "mutedRole" then that can not be muted again
    if (toMute.roles.cache.has(mutedRole)) message.channel.send(Embed({preset:`error`, description: `This user has already been muted!`}));

      // Check current time and add muted time to it, then convert to seconds from milliseconds
      client.muted[toMute.id] = {
        guild: message.guild.id,
        time: Date.now() + ms(args[1])
        //parseInt(args[1]) * 1000
      };

      //Add the mute punishment to the sqlite database
      await Utils.Variables.database.punishments.addPunishment({
        type: `mute`,
        user: toMute.id,
        reason: args.slice(2).join(" ") || "No Reason",
        time: message.createdAt.getTime(),
        executor: message.author.id
    })

    await Utils.DB.punishments.addStrike({
      user: toMute.id,
      reason: `Mute +1 | ${args.slice(2).join(" ")}`,
      time: message.createdAt.getTime(),
      executor: message.author.id
  })
    
      // Add the mentioned user to the "mutedRole" and notify command sender
      await toMute.roles.add(mutedRole);
    
      //Add the muted user to the json file for removal later when time is due. 
      //Simple way to continue on if the bot restarts
      fs.writeFile('./data/muted.json', JSON.stringify(client.muted, null, 4), err => {
        if (err) throw err;
        message.channel.send(Embed({title:`Muted User`, description: `${toMute.user.tag}`, footer: `Reason: ${args.slice(2).join(" ") || "No Reason"} | Muted For ${Utils.DDHHMMSSfromMS(ms(args[1]))}`}));
      });
  }else{
    message.channel.send(Embed({preset:`error`, description: `Please enter the correct time length.. 1d2h || 12h (Must be lowercase)`}));
  }
  

}
