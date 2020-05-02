const Utils = require('../modules/utils')
const Embed = Utils.Embed;



const cooldowns = {
  coins: {
      cooldownSeconds: 5,
      cooldown: new Set()
  },
  xp: {
      cooldownSeconds: 5,
      cooldown: new Set()
  },
  cmd: []
}


// The MESSAGE event runs anytime a message is received
module.exports = async (client, message) => {

  
    if (/.+\-[0-9]{4}/.test(message.channel.name)) {
      // TRANSCRIPTS
      Utils.transcriptMessage(message);
    }
      // Ignore Bots
    if (message.author.bot) return;

    async function advertisement(text, ignoreIfInWhitelist = true) {
    if (!text) {
        console.log(`[ERROR] Invalid input for advertisement: ${text}`);
        return false;
    }
    if (text.includes(client.config.Whitelisted_Websites) && ignoreIfInWhitelist) return false;
    return /(https?:\/\/)?((([A-Z]|[a-z])+)\.(([A-Z]|[a-z])+))+(\/[^\/\s]+)*/.test(text);
  }


    async function autoMod(message){
      const msg = message.content;
      advertisement(msg, false);

      if(msg.includes(`discord.gg/` || `discordapp.com/invite/`)) {
        return message.delete().then(async function() {
          message.channel.send(`Advertising other discords now? Thats now allowed here!`).then(mesg => mesg.delete({timeout: 5000}));
        })
      }

    }

    autoMod(message);


    //Setup For Prefix
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
  
    //XP System
      /*let {xlevel, xp} = await Utils.DB.get.getExperience(message.member);
      if(!cooldowns.xp.cooldown.has(message.author.id)) {
        let amt = ~~(Math.random() * 10) +5;
        let xpNeeded = ~~((xlevel * (175 * xlevel) * 0.5)) - amt - xp;
        if (xpNeeded <= 0) {
          xlevel++;
            const embed = Embed({
                title: `⬆Level Up`,
                description: `<@${message.author.id}> You've leveled up to level ${xlevel}`
            });
            if (!Utils.findChannel(`Level-Up`, message.guild, 'text', false)) message.channel.send(embed).then(msg => true ? msg.delete({timeout: 5000}) : '');
            if (Utils.findChannel(`Level-Up`, message.guild)) Utils.findChannel(`Level-Up`, message.guild).send(embed)
        }
        await Utils.DB.experience.updateExperience(message.member, xlevel, amt, 'add');
        Utils.Logger.debug(`XP System ${amt} | ${xlevel}`)

        if (!message.author.roles.has(`704585485263175690`)) cooldowns.xp.cooldown.add(message.author.id);
        setTimeout(function () {
            if (!message.author.roles.has(`704585485263175690`)) cooldowns.xp.cooldown.delete(message.author.id);
        }, cooldowns.xp.cooldownSeconds * 1000);
      }
      */

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