const Utils = require(`../modules/utils`)
const Embed = Utils.Embed;
// voiceStateUpdate
/* Emitted whenever a member changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
PARAMETER      TYPE           DESCRIPTION
oldState       VoiceState        The voice state before the update    
newState       VoiceState        The voice state after the update    */
module.exports = async (client, oldState, newState) => {
    let newUserChannel = newState.channel;
    let oldUserChannel = oldState.channel;
    let member = newState.member;

    const chan = Utils.findChannel(`mod-logs`, newState.guild);



    if(oldUserChannel === null && newUserChannel !== null) {
        // User Joins a voice channel
        let embed = Embed({
        title: 'User Joined VC',
        description: `${member.user.username} Has Joined ${newUserChannel}`,
        footer: { text: client.config.footer , icon_url: `http://itzdabbzz.me/titanlogo.png` },
        color: `#0048ff`,
        timestamp: new Date(),
        author: { name: member.user.username, icon: member.user.displayAvatarURL({format:`png`, dynamic: true}) },
    })
    
    chan.send(embed)


     } else if(newUserChannel === null){
         
       // User leaves a voice channel
       let embed = Embed({
        title: 'User Left VC',
        description: `${member.user.username} Has Left  ${oldUserChannel}`,
        footer: { text: client.config.footer , icon_url: `http://itzdabbzz.me/titanlogo.png` },
        color: `#ffd900`,
        timestamp: new Date(),
        author: { name: member.user.username, icon: member.user.displayAvatarURL({format:`png`, dynamic: true}) },
    })
    
    chan.send(embed)

     }
}