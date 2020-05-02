const Utils = require(`../modules/utils`);
const Embed = Utils.Embed;

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["adduser", "tadd"],
    permLevel: "Moderator"
  };
  
  exports.help = {
    name: "add",
    category: "Tickets",
    description: "Add's a user to a ticket",
    usage: "<@user>"
  };
  
exports.run = async (client, message, args) => {
  const ticket = await Utils.DB.tickets.getTickets(message.channel.id);
  if (!ticket) return message.channel.send(Embed({ preset: 'error', description: 'This ticket does not exist in the database.' }));

  const user = Utils.getMember(message, args.join(" "));
  if (args.length == 0 || !user) return message.channel.send(Embed({ preset: 'invalidargs', usage: module.exports.help.usage }));
  if (user.id == message.author.id) return message.channel.send(Embed({ preset: 'error', description: 'You already have access to this ticket.' }));


  const AddedUsers = await Utils.DB.get.getAddedUsers(message.channel.id);
  if (AddedUsers.map(u => u.user).includes(user.id)) return message.channel.send(Embed({ preset: 'error', description: 'This user has already been added to the ticket.' }));

  await Utils.DB.tickets.addedUsers.add(message.channel.id, user.id);

  message.channel.updateOverwrite(user.id, {
      VIEW_CHANNEL: true, 
      SEND_MESSAGES: true, 
      READ_MESSAGES: true, 
      ADD_REACTIONS: true, 
      READ_MESSAGE_HISTORY: true
  })

  await message.channel.send(Embed({ title: 'User Added', description: "User ``" + user.user.tag + "`` has been added to this ticket!" }));
}
