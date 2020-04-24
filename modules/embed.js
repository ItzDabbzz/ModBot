const { RichEmbed } = require('discord.js');

let Theme_Color = parseInt("#fffff", 16);
let Error_Color = parseInt("#FF0000", 16);

/*let embed = Embed({
    title: 'Title',
    description: `Description`,
    footer: { text: `footer.text`, icon_url: `footer.icon` },
    color: `#ANY HTML COLOR CODE`,
    fields: [{
        name: 'Field 1',
        value: 'Value 1'
    },
    {
        name: 'Field 2',
        value: 'Value 2'
    }],
    timestamp: new Date(),
    thumbnail: 'http://imgur.com/',
    image: `http://imgur.com/`,
    author: { name: author.text, icon: embed.author.icon },
})*/

module.exports = function (embedOptions) {
    if(embedOptions.preset) {
        switch(embedOptions.preset) {
            case 'nopermission':
                return {
                    embed: {
                        color: `#FF0000`,
                        title: "No Permission",
                        description: 'You do not have permission to run this command.',
                        timestamp: new Date()
                    }
                }
            case 'ready':
                return {
                    embed: {
                        color: `#00ff33`,
                        title: "Succesful",
                        description: 'It Worked!',
                        timestamp: new Date()
                    }
                }
            case 'invalidargs':
                return {
                    embed: {
                        color: `#FF0000`,
                        title: "Invalid Arguments",
                        description: `Usage: \`\`${Config.Bot_Prefix}${embedOptions.usage}\`\``,
                        timestamp: new Date()
                    }
                }
            case 'error':
                if (embedOptions.description && !embedOptions.usage) return {
                    embed: {
                        color: `#FF0000`,
                        title: embedOptions.description,
                    }
                }
                if (embedOptions.description && embedOptions.usage) return {
                    embed: {
                        color: `#FF0000`,
                        title: embedOptions.description,
                        description: 'Usage: ' + Config.Bot_Prefix + embedOptions.usage
                    }
                }
                return {
                    embed: {
                        color: `#FF0000`,
                        title: 'Error',
                        description: 'An error has occurred.'
                    }
                }
                case 'console':
                    return {
                        embed: {
                            color: `#FF0000`,
                            title: 'An error has occured while running this command. Please check console.'
                        }
                    }
                default:
                    return {
                        embed: {
                            color: Theme_Color,
                            title: "Error",
                            description: "An error has occurred."
                        }
                    }
        }
    }else {
        const embed = embedOptions;
        if (embed.color) embed.color = parseInt(embed.color.replace(/#/g, ''), 16);
        else embed.color = Theme_Color;
        if (embed.footer) {
            const footer = embed.footer;
            if (typeof footer == "string")
                embed.footer = { text: footer };
            else if (embed.footer.icon)
                embed.footer = { text: footer.text, icon_url: footer.icon }
        }
        if (embed.author) {
            const author = embed.author;
            if (typeof author == "string")
                embed.author = { name: author };
            if (embed.author.icon)
                embed.author = { name: author.text, icon: embed.author.icon };
        }
        if (embed.thumbnail)
            embed.thumbnail = { url: embed.thumbnail };
        if (embed.image)
            embed.image = { url: embed.image };
        return { embed: embed };
    }
}

