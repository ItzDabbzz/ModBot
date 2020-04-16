const {Client, RichEmbed} = require("discord.js");
module.exports = async (client, error) => {
    client.logger.log(`An error event was sent by Discord.js: \n`, "error");
    const settings = client.getSettings(member.guild.id);

    const cChannel = settings.clogChannel;

    const errorEmbed = new RichEmbed()
	.setColor('#0099ff')
	.setTitle('WolfMC | Logs')
	.setURL('https://wolfmc.net')
	.setAuthor('ItzDabbzz', '', 'https://itzdabbzz.me')
	.setDescription('Error')
	.setThumbnail('https://mpng.pngfly.com/20180320/rue/kisspng-error-computer-icons-orange-error-icon-5ab143d3089ac7.8478409115215666750353.jpg')
	.addField('This was sent by Discord.JS')
	.addBlankField()
	.addField('Error:', '${JSON.stringify(error)}')
	.setTimestamp()
	.setFooter('ERROR', 'https://mpng.pngfly.com/20180320/rue/kisspng-error-computer-icons-orange-error-icon-5ab143d3089ac7.8478409115215666750353.jpg');

    const channel = client.channels.get(cChannel);
    channel.send(errorEmbed)

};