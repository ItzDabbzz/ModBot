const Utils = require(`../modules/utils`);
const Embed = Utils.Embed;

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Server Owner"
  };
  
  exports.help = {
    name: "rules",
    category: "Miscellaneous",
    description: "Rules Test Command",
    usage: ""
  };
  
exports.run = async (client, message, args) => {
  let embed = Embed({
    title: `Welcome to NA-Pug`,
    fields: [{
        name: 'Official Rules',
        value: `
        1. Toxicity is not at all allowed in this server. If you are found to be toxic, you will immediately be removed from the server.
        2. Racism, sexism, sexually intense speech, or any language to harass a certain type of people or specific person is NOT tolerated at all.
        3. Any threats to do anything harmful to the server or other players, will get you banned (DDoS, dox, etc.)
        4. Any form of ban evasion or helping ban evade will get you and your main account permanently banned.
        5. Pictures may only be posted in #content-sharing 
        6. Do not spam any chat or hot mic/mic spam in voice chat. This also includes using a soundboard.
        7. Do not @ groups for no reason, especially Staff, your post will be deleted and you will face consequences.
        8. ALWAYS listen to Staff unless told otherwise by a higher up.
        9. Do not disrespect an Owner, Admin, or Staff member.
        10. In this server, you must follow Discord Terms of Service at all times. Any violation will result in an immediate ban.
        11. Most importantly, remember that everyone is a living being behind a screen and has feelings. Do not treat others as if they don't have feelings or emotions.`,
        inline: false
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
    image: message.author.icon,
    footer: `NA-Pug | ${client.config.footer}`
})
  
  await message.channel.send(embed);
}


