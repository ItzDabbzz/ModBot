const Utils = require('../modules/utils')

// The MESSAGE event runs anytime a message is received
module.exports = async (client, message) => {
    // Ignore Bots
    if (message.author.bot) return;
  
      let prefix;
  
      prefix = `!`
  
      if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;
  
      const prefixes = [prefix, `<@!${client.user.id}>`, `<@${client.user.id}>`];
      
      prefix = prefixes.find(p => message.content.startsWith(p));
  
    // Ignore all messages that dont start with the prefix
      if (message.content.indexOf(prefix) !== 0) return;
      if (!prefix) return;
      message.prefix = prefix
  
    // Checks if the bot was mentioned, with no message after it, returns the prefix.
    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
      return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
    }
  
    // Here we separate our "command" name, and our "arguments" for the command.
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    // If the member on a guild is invisible or not cached, fetch them.
    if (message.guild && !message.member) await message.guild.fetchMember(message.author);
  
    // Get the user or member's permission level from the elevation
    const level = client.permlevel(message);
  
    // Check whether the command, or alias, exist in the collections defined
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return;
  
    // Some commands may not be useable in DMs. This check prevents those commands from running
    // and return a friendly error message.
    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");
  
    if (level < client.levelCache[cmd.conf.permLevel]) {
          return message.channel.send(`You do not have permission to use this command.
          Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
          This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    }
  
    // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
    message.author.permLevel = level;
    
    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
    // If the command exists, **AND** the user has permission, run it.
    Utils.Logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
    cmd.run(client, message, args, level);
  };