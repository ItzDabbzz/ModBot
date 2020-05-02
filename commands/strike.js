const Utils = require(`../modules/utils`);
const Embed = Utils.Embed;

exports.run = async (client, message, args) => {

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) {
            return message.reply("Please provide a person to Strike.")
                .then(m => m.delete({timeout: 5000}));
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please provide a reason to Strike.")
                .then(m => m.delete({timeout: 5000}));
        }

        // No author permissions
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ You do not have permissions to Strike members. Please contact a staff member")
                .then(m => m.delete({timeout: 5000}));
        }
        // No bot permissions
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ I do not have permissions to Strike members. Please contact a staff member")
                .then(m => m.delete({timeout: 5000}));
        }

        const toBan = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(" ");
        // No member found
        if (!toBan) {
            return message.reply("Couldn't find that member, try again")
                .then(m => m.delete({timeout: 5000}));
        }

        // Can't ban urself
        if (toBan.id === message.author.id) {
            return message.reply("You can't Strike yourself...")
                .then(m => m.delete({timeout: 5000}));
        }

        // Check if the user's banable
        if (!toBan.bannable) {
            return message.reply("I can't Strike that person due to role hierarchy, I suppose.")
                .then(m => m.delete({timeout: 5000}));
        }

        let promptEmbed = Embed({
                description: `Do you want to Strike ${toBan}?`,
                timestamp: new Date(),
                author: `This verification becomes invalid after 30s.`,
                footer: `${client.config.footer}`,
                color: `#4bf542`
            })

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await client.promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                msg.delete();

                await Utils.DB.punishments.addStrike({
                    user: toBan.id,
                    reason: reason,
                    time: message.createdAt.getTime(),
                    executor: message.author.id
                })

                //await client.db.createPunish(client, message, type, toBan, reason, modLogs);
                Utils.Logger.log(`User Strike ${toBan}`);
                toBan.ban({days: 7 , reason: reason})
                    .catch(err => {
                        if (err) return message.channel.send(`Well.... the Strike didn't work out. Here's the error ${err}`)
                    });

                //logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Strike canceled.`)
                    .then(m => m.delete({timeout:10000}));
            }
        });
    };

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};
  
exports.help = {
  name: "Strike",
  category: "Moderation",
  description: "Strikes a user",
  usage: "<id | mention> <reason>"
};