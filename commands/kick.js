const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../modules/functions");

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "kick",
  category: "Moderation",
  description: "Kicks a user",
  usage: "<id | mention> <reason>"
};

exports.run = async (client, message, args) => {
        if (message.deletable) message.delete();

        // No args
        if (!args[0]) {
            return message.reply("Please provide a person to kick.")
                .then(m => m.delete({timeout: 5000}));
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please provide a reason to kick.")
                .then(m => m.delete({timeout: 5000}));
        }

        // No author permissions
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ You do not have permissions to kick members. Please contact a staff member")
                .then(m => m.delete({timeout: 5000}));
        }

        // No bot permissions
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ I do not have permissions to kick members. Please contact a staff member")
                .then(m => m.delete({timeout: 5000}));
        }

        const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);
        const reason = args.slice(1).join(" ");
        // No member found
        if (!toKick) {
            return message.reply("Couldn't find that member, try again")
                .then(m => m.delete({timeout: 5000}));
        }

        // Can't kick urself
        if (toKick.id === message.author.id) {
            return message.reply("You can't kick yourself...")
                .then(m => m.delete({timeout: 5000}));
        }

        // Check if the user's kickable
        if (!toKick.kickable) {
        
            return message.reply("I can't kick that person due to role hierarchy, I suppose.")
                .then(m => m.delete({timeout: 5000}));
        }


        let promptEmbed = client.embed({
                description: `Do you want to kick ${toKick}?`,
                timestamp: new Date(),
                author: `This verification becomes invalid after 30s.`,
                footer: `${client.config.footer}`,
                color: `#4bf542`
            })

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reaction collector
            const emoji = await client.promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // The verification stuffs
            if (emoji === "✅") {
                msg.delete();
                await Utils.Variables.database.punishments.addPunishment({
                    type: `kick`,
                    user: toKick.id,
                    reason: reason,
                    time: message.createdAt.getTime(),
                    executor: message.author.id
                })
                Utils.Logger.log(`User Kicked ${toKick}`);
                toKick.kick({reason: reason})
                    .catch(err => {
                        if (err) return message.channel.send(`Well.... the kick didn't work out. Here's the error ${err}`)
                    });

                //logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Kick canceled.`)
                    .then(m => m.delete({timeout: 10000}));
            }
        });
    };
