const Utils = require(`../modules/utils`);
const Embed = Utils.Embed;

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Server Owner"
  };
  
  exports.help = {
    name: "new",
    category: "Tickets",
    description: "Creates a ticket",
    usage: "<reason>"
  };

  function increase(string) {
    const num = parseInt(string) + 1;
    return ('0'.repeat(4 - num.toString().length)) + num;
}
  
exports.run = async (client, message, args) => {

  const tickets = await Utils.DB.tickets.getTickets();

  const reason = args.join(" ") || "No Subject";

  const newestTicket = tickets.sort((a, b) => parseInt(b.channel_name.match(/\d+/)[0]) - parseInt(a.channel_name.match(/\d+/)[0]))[0];
  const next_ticket_number = newestTicket ? (increase(newestTicket.channel_name.match(/\d+/)[0])) : '0000';


  let staff = Utils.findRole(`Staff`, message.guild)
  let category = Utils.findChannel(`Open Tickets`, message.guild, 'category');

  if (!staff) return message.channel.send(Embed({ preset: 'error', description: 'Comamnd failed. Cant Find The Role Staff' }));
  if (!category) return message.channel.send(Embed({ preset: 'error', description: 'Comamnd failed. Cant find the Open Tickets category.' }));
   

  message.guild.channels.create(`ticket-${next_ticket_number}`, {
    type: 'text',
    permissionOverwrites: [{
      id: message.guild.id,
      deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
    }, {
      id: staff.id,
      allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
    }, {
      id: message.author.id,
      allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
    }, {
      id: client.user.id,
      allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
    }],
    parent: category
  }).then(async ch => {

    ch.send(`<@&${staff.id}>`)

    let embed = Embed({
      title: `Welcome ${message.author.username}`,
      description: `Reason: ${reason}
      Support will be with you shortly. 
      React With 🔐 To Close The Ticket`,
      footer: { text: `Titan Leauge`, icon_url: message.guild.iconURL({format:`png`, dynamic:true}) },
      color: `#03fcd3`,
      timestamp: new Date(),
    })

    
  
    await ch.send(embed).then(async msg => { 
      msg.react(`🔐`);

      Utils.DB.tickets.createTicket({
        guild: message.guild.id,
        channel_id: ch.id,
        channel_name: ch.name,
        creator: message.author.id,
        reason: reason,
        username: message.author.tag
      })

  });



  });

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
}
