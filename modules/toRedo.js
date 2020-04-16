const fetch = require("node-fetch");
const errors = require('../../DabbzzBot v1.0/modules/errors')

const Utils = require('../../DabbzzBot v1.0/modules/utils');
const Embed = Utils.Embed;

module.exports = (client) => {

    client.findLogs = async (client, message, modLogs) => {
        const prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();
        if (!modLogs || !message.guild.channels.find(c => c.name === modLogs)) {
            const embed = Embed({
              title: `An error has occurred!`,
              description: `No log channel found with the name \`${modLogs}\`.`,
              color: client.config.embedRed,
              footer: `${client.config.footer} |  Use ${prefix}edit modlogs to change this.`
            })
            return message.channel.send(embed), false;
        } else {
            return true;
        }
    };

    client.findPunishment = async (message, punishment) => {
        if (!punishment) {
            const embed = Embed({
              title: `An error has occurred!`,
              description: `A punishment with the specified ID hasn't been found.`,
              color: client.config.embedRed,
              footer: `${client.config.footer} | ${message.author.tag}`
            })
            return message.channel.send(embed), false;
        } else {
            return true;
        }
    };

    client.sendTicket = async (message, user, reason, id) => {

      let embed = Embed({
        title: `:ticket: Ticket Log`,
        description: `Guild name: ${message.guild.name}`,
        color: client.config.embedAqua,
        footer: ` ID: ${id} | ${client.config.footer}`,
        timestamp: new Date(),
        fields: [{
          name: `User:`,
          value: `${user} (${user.id})`,
        },
        {
          name: 'Reason:',
          value: `${reason}`
        }]})

      let tLogsChannel = message.guild.channels.cache.find(c => c.name === "ticket-logs");
      if (!tLogsChannel) return await errors.couldNotLog(message, "mod-logs");
      if (!tLogsChannel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
          return await tLogsChannel.send([
              ":ticket: Ticket Logs",
              `**Action: ${type}**\nGuild name: ${message.guild.name}`,
              `**User:**\n${user} (${user.id})`,
              `**Reason:**\n ${reason}`,
              `ID:\n${id}`
          ].join("\n")).catch(async err => {
              await errors.couldNotLog(message, modLogs);
          }) 
      };
      await tLogsChannel.send(embed)
          .catch(async () => {
              await errors.couldNotLog(message, modLogs);
          });
      await user.send(embed)
      .catch(async () => {
          await errors.couldNotDM(message);
      });
  };

    client.sendUser = async (elo, rank, party, user, id) => {
        let embed = new RichEmbed()
            .setTitle(":bust_in_silhouette: User Logs")
            .setDescription(`Guild name: ${user.guild.name}`)
            .setColor(config.embedAqua)
            .setTimestamp()
            .addField("User:", `${user} (${user.id})`, true)
            .addField("Elo:", `${elo}`, true)
            .addField("Rank:", `${rank}`, true)
            .addField("Party:", party, true)
            .setFooter(`${client.config.footer}| ID: ${id}`);
        let modLogsChannel = user.guild.channels.find(c => c.name === "mod-logs");
        if (!modLogsChannel) return await errors.couldNotLog(message, "mod-logs");
        if (!modLogsChannel.permissionsFor(user.guild.me).has("EMBED_LINKS")) {
            return await modLogsChannel.send([
                "User Logs",
                `**Action: ${type}**\nGuild name: ${user.guild.name}`,
                `**User:**\n${user} (${user.id})`,
                `**Elo:**\m${elo}`,
                `**Rank:**\n ${rank}`,
                `**Party:**\n ${party}`,
                `ID:\n${id}`
            ].join("\n")).catch(async err => {
                //await errors.couldNotLog(message, modLogs);
            }) 
        };
        await modLogsChannel.send(embed)
            .catch(async () => {
                //await errors.couldNotLog(message, modLogs);
            });
        //await user.send(embed)
        //.catch(async () => {
            //await errors.couldNotDM(message);
        //});
    };


    client.sendPunishment = async (message, type, user, reason, modLogs, id) => {
      let embed = Embed({
        title: `Punishment Logs`,
        description: `**Action: ${type}**\nGuild name: ${message.guild.name}`,
        color: client.config.embedPink,
        footer: `${client.config.footer} | ID: ${id}`,
        fields: [{
          name: `User:`,
          value: `${user} (${user.id})`,
        },
        {
          name: 'Reason:',
          value: `${reason}`
        },
        {
          name: 'Action by:',
          value: `${message.author} (${message.author.id})`
        }]})

        let modLogsChannel = message.guild.channels.cache.get(c => c.name === `mod-logs`);
        if (!modLogsChannel) return await errors.couldNotLog(message, modLogs);
        if (!modLogsChannel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            return await modLogsChannel.send([
                "Punishment Logs",
                `**Action: ${type}**\nGuild name: ${message.guild.name}`,
                `**User:**\n${user} (${user.id})`,
                `**Action by:**\n ${message.author} (${message.author.id})`,
                `**Reason:**\n ${reason}`,
                `ID:\n${id}`
            ].join("\n")).catch(async err => {
                await errors.couldNotLog(message, modLogs);
            }) 
        };
        await modLogsChannel.send(embed)
            .catch(async () => {
                await errors.couldNotLog(message, modLogs);
            });
        await user.send(embed)
            .catch(async () => {
                await errors.couldNotDM(message);
            });
    };

    client.sendReport = async (message, user, reason, modLogs, id) => {
        let embed = Embed({
          title:"Report",
          description: `Guild name: ${message.guild.name}`,
          color: client.config.embedRed,
          footer: `${client.config.footer} | ID: ${id}`,
          fields: [
            {
              name: 'User:',
              value: `${user} (${user.id})`
            },
            {
              name: 'Action by:',
              value: `${message.author} (${message.author.id})`
            },
            {
              name: 'Reason:',
              value: reason
            }
          ]
        })
        let reportsChannel = message.guild.channels.cache.find(c => c.name === `reports`);
        if (!reportsChannel) return await errors.couldNotLog(message, modLogs);
        if (!reportsChannel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            return await reportsChannel.send([
                "Report",
                `Guild name: ${message.guild.name}`,
                `**User:**\n${user} (${user.id})`,
                `**Action by:**\n ${message.author} (${message.author.id})`,
                `**Reason:**\n ${reason}`,
                `ID:\n${id}\n**R6Bot**`
            ].join("\n")).catch(async err => {
                await errors.couldNotLog(message, modLogs);
            }) 
        };
        await reportsChannel.send(embed)
            .catch(async () => {
                await errors.couldNotLog(message, modLogs);
            });
        await user.send(embed)
            .catch(async () => {
                await errors.couldNotDM(message);
            });
    };

}