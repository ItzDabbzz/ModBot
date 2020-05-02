
const Utils = require(`../modules/utils`)
const Embed = Utils.Embed;
// guildBanRemove
/* Emitted whenever a member is unbanned from a guild.
PARAMETER    TYPE         DESCRIPTION
guild        Guild        The guild that the unban occurred in
user         User         The user that was unbanned    */
module.exports = async (client, guild, user) => {
    const chan = Utils.findChannel(`mod-logs`, guild)
    let embed = Embed({
        title: 'User Unbanned',
        description: `${user.username} Has Been Unbanned!`,
        footer: { text: client.config.footer , icon_url: `http://itzdabbzz.me/titanlogo.png` },
        color: `#ffff00`,
        timestamp: new Date(),
        author: { name: user.username, icon: user.displayAvatarURL({format:`png`, dynamic: true}) },
    })

    chan.send(embed)
}