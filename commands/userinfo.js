const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const Utils = require(`../modules/utils`);
const Embed = Utils.Embed

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
    const member = Utils.getMember(message, args.join(" "));

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

    //const reports = Utils.Variables.database.get.getReportsNum(member.id);
   // const mutes = Utils.Variables.database.get.getMutesNum(member.id);
    const history = Promise.resolve(Utils.Variables.database.get.getPunishmentsForUser(member.id));

    history.then(function(value) { 
        //get user punishments
        const kickable = member.kickable ? "✅" : "❎";
        const bannable = member.bannable ? "✅" : "❎";
        let embed = Embed({
            title: 'User Information',
            fields: [{
                name: 'Member information:',
                value: stripIndents`**> Display name:** ${member.displayName}
                **> Joined at:** ${joined}
                **> Roles:** ${roles}
                **> Created:** ${created}`,
                inline: true
            },
            {
                name: 'User information:',
                value: stripIndents`**> ID:** ${member.user.id}
                **> Username**: ${member.user.username}
                **> Nickname**: ${nickname}
                **> Tag**: ${member.user.tag}
                **> Status**: ${member.presence.activities}`,
                inline: true
            },
            {   
            name: 'Punishments:',
            value: stripIndents`**> Mutes**: ${value.length}
            **> Kickable**: ${kickable}
            **> Bannable**: ${bannable}`
            }],
            timestamp: new Date(),
            color: member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor,
            author: message.author.displayName,
            footer: `User: ${member.displayName} | Guild: ${message.guild.name}`,
            thumbnail: member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })  
        })
        
        if (member.user.presence.game) 
            embed.embed.fields.push({ name: `Currently playing`, value: stripIndents`**> Name:** ${member.user.presence.game.name}`, inline: true});

        message.channel.send(embed);
    })
   

};