exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "vkick",
  category: "Moderation",
  description: "Kick a User out of a Voice Chat",
  usage: "<id | mention> <reason>"
};

exports.run = async (client, message, args) => {
      const modLogs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run();
      const type = "voicekick";
      const user = message.mentions.users.first() || client.users.cache.get(args[0]);
      if(!user) return message.reply("You must mention someone or give their ID!");
      const reason = args.slice(1).join(" ");
      const member = message.guild.member(user);
      member.voice.setChannel(null, `DabbzzBot | Voice Kick by ${message.author.name}`);
      message.react("✅");
      client.db.createPunish(client, message, type, user, reason, modLogs);
      client.logger.log(`${user} Voice Kicked By ${message.author.name}`);
  }
