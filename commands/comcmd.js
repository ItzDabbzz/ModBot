const Utils = require(`../modules/utils`);
const Embed = Utils.Embed;

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Server Owner"
  };
  
  exports.help = {
    name: "cmds",
    category: "Miscellaneous",
    description: "Rules Test Command",
    usage: ""
  };
  
exports.run = async (client, message, args) => {
  let embed = Embed({
    fields: [{
        name: '📝FAQ',
        value: `
        Question: Who starts on Attack and Defense?
        Answer: Team 1 will attack first. Team 2 will defend first.

        Question: Can we spawn peak, spawn rush, or runout?
        Answer:
        1. Spawning peeking is allowed 2 seconds into the round 
        2. Spawn rushing is not allowed
        3. Runouts are allowed 5 seconds into the round

        Question: Can I change my name?
        Answer: Yes, but only a staff member may change it for you. Open a ticket asking for the change and keep in mind that this will only be done once every 30 days.

        Question: Are re-hosts allowed?
        Answer:  Each team is allowed 1 re-host per match

        Question: Can we sub someone in mid game?
        Answer: A sub can be made as long as its before the end of round 3.

        Question: Are cosmetic skins allowed?
        Answer: Yes, we cannot control this aspect of the game.

        Question: Can we play on a different map than the one the bot gave us?
        Answer: No`,
    }],
    timestamp: new Date(),
    image: message.author.icon,
    footer: `NA-Pug | ${client.config.footer}`
})
  
  await message.channel.send(embed);
}


