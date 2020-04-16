// Used if response isn't recognised in the 'edit' command
const config = require('../config');
const Embed = require('./embed');

module.exports.responseNotRecognised = async (client, message, response) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send(`The value \`${response}\` could not be used`).catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete({timeout:60000}).catch(err => {});
        });
    };

    let embed = client.embed({
        title: `An error has occurred!`,
        description: `The value ${response} could not be used.`,
        color: config.embedRed,
        footer: `${message.author.tag}`,
        thumbnail: `${message.author.avatarURL}`
    })

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete({timeout:60000}).catch(err => {});
    });
};

module.exports.sameSetting = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("The response given is already the set value").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete({timeout:60000}).catch(err => {});
        });
    };

    let embed = client.embed({
        title: `An error has occurred!`,
        description: `The response given is already the set value.`,
        color: config.embedRed,
        footer: `${message.author.tag}`,
        thumbnail: `${message.author.avatarURL}`
    })

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete({timeout:60000}).catch(err => {});
    });
};

// Used if no arguments are given.
module.exports.noArgs = async (message, exports) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send(`Missing arguments!\nUsage \`${exports.help.usage}\``).catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete({timeout:60000}).catch(err => {});
        });
    };

    let embed = Embed({
        title: `An error has occurred!`,
        color: config.embedRed,
        footer: `${message.author.tag}`,
        thumbnail: `${message.author.avatarURL}`
    })
    
    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete({timeout:60000}).catch(err => {});
    });
};

module.exports.couldNotLog = async (message, modLogs) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send(`Could not log the punishment to \`${modLogs}\`. Make sure the bot has the permission to read and send messages in this channel.`).catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete({timeout:60000}).catch(err => {});
        });
    };

    let embed = Embed({
        title: `An error has occurred!`,
        description: `Could not log the punishment to \`${modLogs}\`. Make sure the bot has the permission to read and send messages in this channel.`,
        color: config.embedRed,
        footer: `${message.author.tag}`,
        thumbnail: `${message.author.avatarURL}`
    })

    return await message.channel.send(embed).catch(err => {}).then(async message => {
        if (!message.deleted) return await message.delete({timeout:60000, reason:"Error Occured Could Not Log"}).catch(err => {});
    });
};

// Used if the bot could not DM a user.
module.exports.couldNotDM = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("Could not send DM to mentioned user").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete({timeout:60000}).catch(err => {});
        });
    };

    let embed = client.embed({
        title: `An error has occurred!`,
        description: `Could not send DM to mentioned user.`,
        color: config.embedRed,
        footer: `${message.author.tag}`,
        thumbnail: `${message.author.avatarURL}`
    })

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete({timeout:60000}).catch(err => {});
    });
};

// Used if args isn't recognised in the 'edit' command
module.exports.settingNotRecognised = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("This setting wasn't recognised.").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete({timeout:60000}).catch(err => {});
        });
    };

    let embed = client.embed({
        title: `An error has occurred!`,
        description: `This setting wasn't recognised.`,
        color: config.embedRed,
        footer: `${message.author.tag}`,
        thumbnail: `${message.author.avatarURL}`
    })

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete({timeout:60000}).catch(err => {});
    });
};
