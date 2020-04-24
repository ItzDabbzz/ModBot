const Utils = require(`../modules/utils`);
const Embed = Utils.Embed;

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Server Owner"
  };
  
  exports.help = {
    name: "tmsg",
    category: "Miscelaneous",
    description: "Ticket MSG Command",
    usage: ""
  };
  
exports.run = async (client, message, args) => {
    let embed = Embed({
      title: `Welome To Titan Leauge`,
      description: ` `,
      fields: [{
          name: `📝 Tickets`,
          value: `React to open a Ticket`
      }],
      timestamp: new Date(),
      image: message.author.icon,
      footer: `Titan Leauge`
  })
  
  await message.channel.send(embed).then(async msg => { msg.react(`✉`)});
}
