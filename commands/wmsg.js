const Utils = require(`../modules/utils`);
const Embed = Utils.Embed;

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Bot Owner"
  };
  
  exports.help = {
    name: "wmsg",
    category: "Miscelaneous",
    description: "Welcome Message Test Command",
    usage: ""
  };
  
exports.run = async (client, message, args) => {
  let embed = Embed({
    title: `Welome ${message.author.displayname} to Titan Leauge`,
    description: `Please make sure to read over all discord rules in <@696609983735005296> `,
    fields: [{
        name: 'How To Play',
        value: `Phoenix League 10 Man Guide | [#rules](https://discordapp.com/channels/701828192729563157/701828192922501252/701851089250681023)
         Go to #register and enter =register (YOURUPLAYNAME)
         Go to #na-que or #eu-que and type =j to join queue
         Once 10 people are joined the match will populate.
         When the match is over you must go to #announcements-gameresults and react to who won the match`
    },
    {
        name: 'Got questions?',
        value: 'Head over to the #support-ticket and react to open a ticket.'
    },
    {
        name: `Ban Appeals`,
        value: `If you'd like to make a ban appeal subit a form using: https://forms.gle/FhBrT1ZDGgokwZ2N7`
    }],
    timestamp: new Date(),
    author: {name: message.author.id, icon: message.author.icon},
    footer: `Titan Leauge`
})
  
  await message.channel.send(embed);
}
