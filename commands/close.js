const Utils = require(`../modules/utils`);
const Embed = Utils.Embed;

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Moderator"
  };
  
  exports.help = {
    name: "close",
    category: "Tickets",
    description: "Closes a ticket",
    usage: ""
  };
  
exports.run = async (client, message, args) => {

  const ticket = await Utils.DB.tickets.getTickets(message.channel.id);

  if (!ticket) return message.channel.send(Embed({ preset: 'error', description: 'This is not a ticket that is in the database.' }));

  async function closeTicket() {
      let channel = Utils.findChannel(`Ticket-Logs`, message.channel.guild);
      channel.send(Embed({
          thumbnail: "https://cdn.discordapp.com/attachments/637105382631669760/640377304954175499/ticket.png",
          title: 'Ticket Closed',
          color: `#ff00fb`,
          fields: [{ name: 'Ticket ID', value: ticket.channel_id }, { name: 'Closed By', value: '<@' + message.author.id + '>' }, { name: 'Ticket Creator', value: `<@${ticket.creator}>` }, { name: 'Added Users', value: (await Utils.DB.tickets.getAddedUsers(ticket.channel_id)).map(u => `<@${u.user}>`).join(', ') || 'None' }, { name: 'Reason', value: ticket.reason }],
      }));

    message.channel.delete();
    require('../modules/transcript.js')(client, message.channel.id);
};

closeTicket();

}
