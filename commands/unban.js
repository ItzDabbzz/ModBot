const Utils = require(`../modules/utils`);
const Embed = Utils.Embed;

exports.run = async (client, message, args) => {
        const type = "unban";

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) {
            return message.reply("Please provide a person to unban.")
                .then(m => m.delete({timeout:5000}));
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please provide a reason to unban.")
                .then(m => m.delete({timeout:5000}));
        }

        // No author permissions
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ You do not have permissions to unban members. Please contact a staff member")
                .then(m => m.delete({timeout:5000}));
        
        }
        // No bot permissions
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ I do not have permissions to unban members. Please contact a staff member")
                .then(m => m.delete({timeout:5000}));
        }

        const toUnban = args[0];
        const reason = args.slice(1).join(" ");
        // No member found
        if (!toUnban) {
            return message.reply("Couldn't find that member, try again")
                .then(m => m.delete({timeout:5000}));
        }

        // Can't ban urself
        if (toUnban.id === message.author.id) {
            return message.reply("You can't unban yourself...")
                .then(m => m.delete({timeout:5000}));
        }

        let promptEmbed = Embed({
                description: `Do you want to unban ${toUnban}?`,
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
                await Utils.Variables.database.punishments.addPunishment({
                    type: `unban`,
                    user: args[0],
                    reason: reason,
                    time: message.createdAt.getTime(),
                    executor: message.author.id
                })
                Utils.Logger.log(`User Unbanned ${toUnban}`);
                message.guild.members.unban(args[0], reason)
                    .catch(err => {
                        if (err) return message.channel.send(`Well.... the unban didn't work out. Here's the error ${err}`)
                    });

                //logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Unbanned canceled.`)
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
  name: "unban",
  category: "Moderation",
  description: "unBans a user",
  usage: "<id | mention> <reason>"
};