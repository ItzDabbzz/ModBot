const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../modules/functions");

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ui', 'whois', 'lmk'],
  permLevel: "Moderator"
};

exports.help = {
  name: "userinfo",
  category: "Moderation",
  description: "Returns a users informations",
  usage: "<id | mention>"
};

exports.run = async (client, message, args) => {
    const member = client.getMember(message, args.join(" "));

    // Member variables
    const joined = client.formatDate(member.joinedAt);
    const roles = member.roles.cache
        .filter(r => r.id !== message.guild.id)
        .map(r => r).join(", ") || 'none';

    // User variables
    const created = client.formatDate(member.user.createdAt);

    let nickname = member.nickname;
    if (nickname) {
        nickname = member.nickname;
    } else {
        nickname = "None"
    };
    
    if (member.presence.activities !== null && member.presence.activities.type === 2 && member.presence.activities.name === "Spotify") {
        const trackURL = `https://open.spotify.com/track/${user.presence.activities.syncID}`;
        playingStatus = `${trackURL}`
    } else if (member.presence.activities) {
        playingStatus = member.presence.activities.name;
    } else {
        playingStatus = "None";
    };

    //get user punishments
    const reports = await client.db.r.table("punishments").run()
    .filter(punishment => punishment.offender === `${message.guild.id}-${member.id}` && punishment.type === `report`);

    const strikes = await client.db.r.table("punishments").run()
    .filter(punishment => punishment.offender === `${message.guild.id}-${member.id}` && punishment.type === `strike`);

    const kicks = await client.db.r.table("punishments").run()
    .filter(punishment => punishment.offender === `${message.guild.id}-${member.id}` && punishment.type === `kick`);

    const kickable = member.kickable ? "✅" : "❎";
    const bannable = member.bannable ? "✅" : "❎";

    
    let embed = client.embed({
        title: 'User Information',
        fields: [{
            name: 'Member information:',
            value: `**> Display name:** ${member.displayName}
            **> Joined at:** ${joined}
            **> Roles:** ${roles}
            **> Created:** ${created}`
        },
        {
            name: 'User information:',
            value: `**> ID:** ${member.user.id}
            **> Username**: ${member.user.username}
            **> Nickname**: ${nickname}
            **> Tag**: ${member.user.tag}
            **> Status**: ${playingStatus}`
        },
        {   
          name: 'Punishments:',
          value: `**> Strikes**: ${strikes.length}
          **> Reports**: ${reports.length}
          **> Kicks**: ${kicks.length}
          **> Kickable**: ${kickable}
          **> Bannable**: ${bannable}`
        }],
        timestamp: new Date(),
        color: member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor,
        author: message.author.displayName,
        footer: `${client.config.footer} | User: ${member.displayName} | Guild ID: ${message.guild.id}`,
        thumbnail: member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })  
    })
    
    /*const embed = new RichEmbed()
        .setFooter(`${client.config.footer} | ${member.displayName}`, member.user.displayAvatarURL)
        .setThumbnail(member.user.displayAvatarURL)
        .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

        .addField('Member information:', stripIndents`**> Display name:** ${member.displayName}
        **> Joined at:** ${joined}
        **> Roles:** ${roles}
        **> Created:** ${created}`, true)

        .addField('User information:', stripIndents`**> ID:** ${member.user.id}
        **> Username**: ${member.user.username}
        **> Nickname**: ${nickname}
        **> Tag**: ${member.user.tag}
        **> Status**: ${playingStatus}`)

        .addField(`Punishments:`, stripIndents`**Strikes**: ${punishments.length}
        **> Bannable**: ${bannable}
        **> Kickable**: ${kickable}`)
        
        .setTimestamp()*/

    //if (member.user.presence.game) 
    //    embed.addField('Currently playing', stripIndents`**> Name:** ${member.user.presence.game.name}`);

    message.channel.send(embed);
};