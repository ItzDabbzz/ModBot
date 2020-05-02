const Utils = require(`../modules/utils`);
const Embed = Utils.Embed;
// This event executes when a new member joins a server. Let's welcome them!
// guildMemberAdd
/* Emitted whenever a user joins a guild.
PARAMETER     TYPE               DESCRIPTION
member        GuildMember        The member that has joined a guild    */
module.exports = (client, member) => {
    // Load the guild's settings
    if(member.bot) return;
    let embed = Embed({
        title: `Welcome ${member.displayName} to NA-Pug`,
        description: `Please make sure to read over all discord rules in [#rules](https://discordapp.com/channels/704194297943294042/704219725575749633) `,
        fields: [{
            name: '10 Man Guide',
            value: `
             Go to [#pug-register](https://discordapp.com/channels/704194297943294042/704217056266158130) and enter =register (YOURUPLAYNAME)
             Go to [#pug-que](https://discordapp.com/channels/704194297943294042/704216976175661057) and type =j to join queue
             Once 10 people are joined the match will populate.
             When the match is over you must go to #pending-scores and react to who won the match`
        },
        {
            name: '❔ Got questions?',
            value: 'Head over to the #support-ticket and react to open a ticket.',
            inline: true
        },
        {
            name: `📝 Ban Appeals`,
            value: `If you'd like to make a ban appeal submit a form using: https://forms.gle/Mztovdk1nkvFFtsu5`,
            inline: true,
        }],
        timestamp: new Date(),
        footer: {text:client.config.footer, icon: member.user.displayAvatarURL({format:`png`, dynamic:true})}
    })

    // Send the welcome message to the welcome channel
    // There's a place for more configs here.
   member.send(embed)

   const mem = member.guild.roles.cache.find(r => r.name.toLowerCase() === `pug member`);
   member.roles.add(mem);


};