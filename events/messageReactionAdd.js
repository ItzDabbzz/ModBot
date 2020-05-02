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

	if(reaction.emoji.name == `2️⃣`){
		let two = Embed({
			title: 'Staff Bible',
			description: `Standard Operating Procedure Handbook`,
			footer: { text: `Page 2/2`, icon_url: `http://itzdabbzz.me/titanlogo.png` },
			color: `#c800ff`,
			fields: [{
				name: 'Closing A Ticket',
				value: ` 
				1) After handling the ticket you have to react to the LOCK reaction.
				2) Then you will react to the check mark if completely finished. (If you aren’t finished with the person making the report click on the X reaction)
				3) Now the ticket will be put into closed section. You can still make notes in this section.(Person who opened the ticket will not be able to see anything at this point)
				4) Last would be to delete the ticket.`,
				inline: true
			},
			{
				name: 'Logging Reports',
				value: `1) To log all reports including warnings, queue bans, name changes, discord temp/perm bans, etc you must use the following command.
				2) **!report <@user> <reason>**`,
				  inline: true,
			},{
			  name: `Punishments`,
			  value: `**Banning a Member**
			  If a staff member needs to ban someone from discord they will need to do the following command. **!ban @user <reason>**
			  \n
			  **Muting a Member**
			  If a member of the discord is causing problems without going to far for a perm ban you will need to use the following command. **!mute @user 1h/d <reason>**
			  (This command will strip the member of all roles so they can’t see anything besides being able to open support tickets)
			  \n
			  `,
			  inline: true
			}],
			timestamp: new Date(),
			author: { name: message.author.username, icon: `http://itzdabbzz.me/titanlogo.png` },
		  })
		reaction.message.edit(two);
	}else if(reaction.emoji.name == `1️⃣`){
		let one = Embed({
			title: 'Staff Bible',
			description: `Standard Operating Procedure Handbook`,
			footer: { text: `Page 1/2`, icon_url: `http://itzdabbzz.me/titanlogo.png` },
			color: `#c800ff`,
			fields: [{
				name: 'Introduction',
				value: `The content below will be “**Titan League**” Standard Operating Procedure Handbook. 
				
				This manual will be the sole document that you go to for reference on how to operate as a staff member on this team. 
				I need every single one of you to perform at your best. We can have the best server out there, but it doesn't mean anything if we don't have a team that runs it well. `,
				inline: true
			},
			{
				name: 'Staff Structure',
				value: `**Owner**
				  - Pays the bills, has the ultimate say in everything regarding the community.
				**Admin** 
				  - Complete all duties of Moderators as needed.
				  - Provide support on the Discord. Complete any task handed to them from up the chain.
				  - *OFFICIAL LEAGUE STRUCTURE COMING SOON*
				**Staff**
				  - First to communicate with players about any issue and determine the course of action. Verify that all the information from the players give them is correct
				  - If they can’t come to a answer. Must contact an admin within the ticket or staff chat.
				  - *OFFICIAL LEAGUE STRUCTURE COMING SOON*`,
				  inline: true,
			},{
			  name: `Staff Responsibilities`,
			  value: `**10 Man Responsibilities**\n
			  - Ensuring all discord rules are being followed within 10-Man chats
			  - Helping new members with getting set-up and knowing the rules
			  - Issue warnings to any member not following rules
			  - Issues proper bannings when players ignore warnings
			  - Remain professional at all times when handling 10 man issues
			  - Make sure all players a reporting the proper score.
			  
			  **Discord Responsibilities**
			  - Remain professional at all times
			  - Remain active to the times you gave us when applying
			  - Answer support tickets in a timely manner
			  - Make sure all discord guidelines are being followed
		`
			}],
			timestamp: new Date(),
			author: { name: message.author.username, icon: `http://itzdabbzz.me/titanlogo.png` },
		})

		reaction.message.edit(one);
	}

	if(reaction.emoji.name == `🗑`){
		if(reaction.message.channel.parent.name == `Closed Tickets`)
		{
			let chan = reaction.message.channel;


			const ticket = await Utils.DB.tickets.getTickets(chan.id);

			if (!ticket) return message.channel.send(Embed({ preset: 'error', description: 'This is not a ticket that is in the database.' }));
		  
			async function transcriptTicket() {
				let channel = Utils.findChannel(`Ticket-Logs`, chan.guild);
				channel.send(Embed({
					thumbnail: "https://cdn.discordapp.com/attachments/637105382631669760/640377304954175499/ticket.png",
					title: 'Ticket Transcripted',
					color: `#ff00fb`,
					fields: [{ name: 'Ticket ID', value: ticket.channel_id }, { name: 'Saved By', value: '<@' + message.author.id + '>' }, { name: 'Ticket Creator', value: `<@${ticket.creator}>` }, { name: 'Added Users', value: (await Utils.DB.tickets.getAddedUsers(ticket.channel_id)).map(u => `<@${u.user}>`).join(', ') || 'None' }, { name: 'Reason', value: ticket.reason }],
				}));
			require('../modules/transcript.js')(client, chan.id);
			};


			transcriptTicket();

			chan.delete(`Ticket Deleted By ${user.username}`);
		}else{
			const successEmbed = Embed({
				color: `#ff0000`, 
				description: `:tickets: <@${message.author.id}> You cant delete this! Its not a Closed Ticket!`,
				timestamp: new Date()})
				reaction.message.channel.send(successEmbed);
		}
	}

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

				let embed = Embed({
					title: `📦Ticket Closed`,
					description: `Closed By: ${user}\n\nReact With 🗑 To Delete The Ticket`,
					timestamp: new Date(),
				})
				message.channel.send(embed).then(msg => {
					msg.react(`🗑`)
				});
				//change channel category to closed tickets
				// remove main ticket user

			}
		})
	}

};