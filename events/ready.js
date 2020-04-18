// ready
/* Emitted when the client becomes ready to start working.    */
const fs = require('fs')
module.exports = async (client) => {

    console.log(`Hi, ${client.user.username} is now online!`);

    client.setInterval(() => {
        for (const i in client.muted) {
            const time = client.muted[i].time;
            const guildId = client.muted[i].guild;
            const guild = client.guilds.cache.get(guildId);
            const member = guild.members.cache.get(i);
            const mutedRole = guild.roles.cache.find(mR => mR.name === 'Muted');
            if (!mutedRole) continue;

            if (Date.now() > time) {
                member.roles.remove(mutedRole);
                delete client.muted[i];
                fs.writeFile('./data/muted.json', JSON.stringify(client.muted), err => {
                    if(err) throw err;
                });
            }
        }
    }, 5000);

    await client.user.setPresence({
        status: "online",
        game: {
            name: "me getting developed",
            type: "STREAMING"
        }
    });
}