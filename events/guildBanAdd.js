const Utils = require(`../modules/utils`)
const Embed = Utils.Embed;
// guildBanAdd
/* Emitted whenever a member is banned from a guild.
PARAMETER    TYPE          DESCRIPTION
guild        Guild         The guild that the ban occurred in
user         User          The user that was banned    */
module.exports = async (client, guild, user) => {
    const chan = Utils.findChannel(`mod-logs`, guild)
    let embed = Embed({
        title: 'User Banned',
        description: `${user.username} Has Been Banned!`,
        footer: { text: client.config.footer , icon_url: `http://itzdabbzz.me/titanlogo.png` },
        color: `#ffff00`,
        timestamp: new Date(),
        author: { name: user.username, icon: user.displayAvatarURL({format:`png`, dynamic: true}) },
    })

    chan.send(embed)
}