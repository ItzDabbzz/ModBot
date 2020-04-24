const Utils = require(`../modules/utils`)
const Embed = Utils.Embed;

function increase(string) {
    const num = parseInt(string) + 1;
    return ('0'.repeat(4 - num.toString().length)) + num;
}

module.exports = async (client, reaction, user) => {

	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	// Now the message has been cached and is fully available
	//console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	//console.log(`${reaction.count} user(s) have given the same reaction to this message! ${reaction.emoji.name}`);

	message = reaction.message;

	if(user.bot) return;

	if(reaction.emoji.name == `🔐`){
		//Close a ticket
		const tickets = await Utils.DB.tickets.getTickets();
		await message.react(`❎`).then(() => message.react(`✅`))

		
		const filter = (reaction, user) => {
			return ['✅', '❎'].includes(reaction.emoji.name) && user.id !== message.author.id;
		};

		message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
		.then(async collected => {
			const reaction = collected.first();

			if (reaction.emoji.name === '❎') {

				const successEmbed = Embed({
				color: `#13bd2a`, 
				description: `:tickets: <@${message.author.id}> You have canceled your ticket close request.`,
				timestamp: new Date()})
				message.channel.send(successEmbed);
			}

			if (reaction.emoji.name === '✅') {

				const channel = reaction.message.channel;
				let ticketUser = await Utils.DB.tickets.getTicketsUser(channel.id);


				let staff = Utils.findRole(`Staff`, message.guild)
				let category = Utils.findChannel(`Closed Tickets`, message.guild, 'category');
			  
				if (!staff) return message.channel.send(Embed({ preset: 'error', description: 'Comamnd failed. Cant Find The Role Staff' }));
				if (!category) return message.channel.send(Embed({ preset: 'error', description: 'Comamnd failed. Cant find the Open Tickets category.' }));

				username = ticketUser.map(async ticket => 
					await channel.edit({
					name:  ticket.username,
					parentID: category.id,
					permissionOverwrites:[{
						id: message.guild.id,
						deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
					}, {
						id: staff.id,
						allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
					},{
						id: client.user.id,
						allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
					}]
					})
				)
				message.channel.send(`Test`);
				//change channel category to closed tickets
				// remove main ticket user

			}
		})
	}

};