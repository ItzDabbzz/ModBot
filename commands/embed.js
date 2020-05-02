  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator"
  };
  
  exports.help = {
    name: "embed",
    category: "Miscellaneous",
    description: "Preview a embed using JSON",
    usage: ""
  };
  
exports.run = async (client, message, args) => {

  let embed, before;

  try {
      embed = JSON.parse(args.join(" "));
      before = JSON.parse(args.join(" "));
  } catch(err) {
      message.reply("Unable to parse your JSON Object. Check the syntax and try again.");
      return this.log("Unable to parse JSON", "error");
  }

  if (embed.colour) embed.color = embed.colour;
  if (embed.color) embed.color = Number(embed.color);

  await message.channel.send(`\`\`\`json\n${JSON.stringify(before, null, 4)}\n\`\`\``, { embed });
  message.delete();
}
