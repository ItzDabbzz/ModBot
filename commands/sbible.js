const Utils = require(`../modules/utils`);
const Embed = Utils.Embed;
const paginationEmbed = require('discord.js-pagination');

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "sbible",
  category: "Moderation",
  description: "Look through the Staff Bible",
  usage: ""
};
  
exports.run = async (client, message, args) => {
  let one = Embed({
    title: 'Staff Bible',
    description: `Standard Operating Procedure Handbook`,
    footer: { text: `${client.config.footer}`, icon_url: `` },
    color: `#c800ff`,
    fields: [{
        name: 'Introduction',
        value: `The content below will be “**NA-Pug**” Standard Operating Procedure Handbook. 
        
        This manual will be the sole document that you go to for reference on how to operate as a staff member on this team. 
        I need every single one of you to perform at your best. We can have the best server out there, but it doesn't mean anything if we don't have a team that runs it well. `,
        inline: true
    },
    {
        name: 'Staff Structure',
        value: `**Owner**
          - Pays the bills, has the ultimate say in everything regarding the community.
        **Admin** 
          - Complete all duties of Moderators as needed.
          - Provide support on the Discord. Complete any task handed to them from up the chain.
        **Staff**
          - First to communicate with players about any issue and determine the course of action. Verify that all the information from the players give them is correct
          - If they can’t come to a answer. Must contact an admin within the ticket or staff chat.`,
          inline: true,
    },{
      name: `Staff Responsibilities`,
      value: `**10 Man Responsibilities**\n
      - Ensuring all discord rules are being followed within 10-Man chats
      - Helping new members with getting set-up and knowing the rules
      - Issue warnings to any member not following rules
      - Issues proper bannings when players ignore warnings
      - Remain professional at all times when handling 10 man issues
      - Make sure all players a reporting the proper score.
      
      **Discord Responsibilities**
      - Remain professional at all times
      - Remain active to the times you gave us when applying
      - Answer support tickets in a timely manner
      - Make sure all discord guidelines are being followed
`
    }],
    timestamp: new Date(),
    author: { name: message.author.username, icon: `` },
})





message.channel.send(one).then(msg => {
  msg.react(`1️⃣`);
  msg.react(`2️⃣`);
});
}
