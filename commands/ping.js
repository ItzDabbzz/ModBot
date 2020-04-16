  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
  };
  
  exports.help = {
    name: "ping",
    category: "Miscelaneous",
    description: "Shows latency and API Ping.",
    usage: ""
  };
  
module.run = async (client, message, args) => {
    const msg = await message.channel.send(`🏓 Pinging....`);

    msg.edit(`🏓 Pong!
    Latency is ${Math.floor(msg.createdTimestap - message.createdTimestap)}ms
    API Latency is ${Math.round(client.ping)}ms`);
}
