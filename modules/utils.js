const net = require('net')
const variables = require('./variables');
module.exports = {
    Discord: require('discord.js'),
    Embed: require('./embed'),
    Logger: require('./Logger'),
    Variables: require('./variables'),
    DB: require('./data'),
    functions: require(`./functions`),
    Client: variables.client,
    transcriptMessage: function (message) {
        const isEmbed = message.embeds.length > 0;

        const embed = {
            fields: [],
            description: "",
            title: "",
            color: ""
        }

        if (isEmbed) {
            embed.fields = message.embeds[0].fields || [];
            embed.description = message.embeds[0].description || '';
            embed.title = message.embeds[0].title || '';
            embed.color = message.embeds[0].hexColor || "#0023b0";
        }

        if (isEmbed) {
            this.DB.sqlite.database.run('INSERT INTO ticketmessages(message, author, authorAvatar, authorTag, created_at, embed_title, embed_description, embed_color, attachment, content, ticket) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [message.id, message.author.id, message.author.displayAvatarURL({format:`png`, dynamic:true, size:128}), message.author.tag, message.createdAt.getTime(), embed.title, embed.description, embed.color, message.attachments.size > 0 ? message.attachments.first().url : undefined, message.content, message.channel.id], function (err) {
                if (err) console.log(err);

                embed.fields.forEach(field => {
                    module.exports.DB.sqlite.database.run('INSERT INTO ticketmessages_embed_fields(message, name, value) VALUES(?, ?, ?)', [message.id, field.name, field.value], function (err) {
                        if (err) console.log(err);
                    })
                })
            })
        } else {
            this.DB.sqlite.database.run('INSERT INTO ticketmessages(message, author, authorAvatar, authorTag, created_at, embed_title, embed_description, embed_color, attachment, content, ticket) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [message.id, message.author.id, message.author.displayAvatarURL({format:`png`, dynamic:true, size:128}), message.author.tag, message.createdAt.getTime(), undefined, undefined, undefined, message.attachments.size > 0 ? message.attachments.first().url : undefined, message.content, message.channel.id], function (err) {
                if (err) console.log(err);
            })
        }
    },
    loadCommand: (commandName) => {
        try {
          variables.logger.cmd(`Loading Command: ${commandName}`);
          const props = require(`../commands/${commandName}`);
          if (props.init) {
            props.init(variables.client);
          }
          variables.client.commands.set(props.help.name, props);
          props.conf.aliases.forEach(alias => {
            variables.client.aliases.set(alias, props.help.name);
          });
          return false;
        } catch (e) {
          return `Unable to load command ${commandName}: ${e}`;
        }
    },
    unloadCommand: async (commandName) => {
        let command;
        if (variables.client.commands.has(commandName)) {
          command = variables.client.commands.get(commandName);
        } else if (variables.client.aliases.has(commandName)) {
          command = variables.client.commands.get(variables.client.aliases.get(commandName));
        }
        if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
        
        if (command.shutdown) {
          await command.shutdown(variables.client);
        }
        const mod = require.cache[require.resolve(`../commands/${command.help.name}`)];
        delete require.cache[require.resolve(`../commands/${command.help.name}.js`)];
        for (let i = 0; i < mod.parent.children.length; i++) {
          if (mod.parent.children[i] === mod) {
            mod.parent.children.splice(i, 1);
            break;
          }
        }
        return false;
    },
    /*
        PERMISSION LEVEL FUNCTION
        This is a very basic permission system for commands which uses "levels"
        "spaces" are intentionally left black so you can add them if you want.
        NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
        command including the VERY DANGEROUS `eval` and `exec` commands!
    */
    permlevel: message => {
        let permlvl = 0;
    
        const permOrder = variables.client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
    
        while (permOrder.length) {
          const currentLevel = permOrder.shift();
          if (message.guild && currentLevel.guildOnly) continue;
          if (currentLevel.check(message)) {
            permlvl = currentLevel.level;
            break;
          }
        }
        return permlvl;
    },
    ping: async function (host, port) {
        const start = Date.now();
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(function () {
                reject("Request timed out");
                socket.end();
            }, 5000);
            const socket = net.createConnection(port, host, () => {
                clearTimeout(timeout);
                resolve(Date.now() - start);
                socket.end();
            });
            socket.on('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });
    },
    findChannel: function (name, guild, type = "text", notifyIfNotExists = true) {
        if (!name || typeof name !== "string") {
            this.Logger.log(`[ERROR] Invalid input for channel: ${name}`, "error");
            return false;
        }
        if (!guild) {
            this.Logger.log(`[ERROR] Invalid input for guild. Channel Name: ${name}`, "error");
            return false;
        }
        if (!['text', 'voice', 'category'].includes(type.toLowerCase())) {
            this.Logger.log(`[ERROR] Invalid type of channel: ${type}`, "error");
            return false;
        }
        const channel = guild.channels.cache.find(c => (c.name.toLowerCase() == name.toLowerCase() || c.id == name) && c.type.toLowerCase() == type.toLowerCase());
        if (!channel) {
            if (notifyIfNotExists)
            this.Logger.log(`[ERROR] The ${name} channel/category was not found! Please create it.`, "error");
            return false;
        }
        return channel;
    },
    findRole: function (name, guild, notifyIfNotExists = true) {
        if (!name) {
            this.Logger.log(`[ERROR] Invalid input for role: ${name}`, "error");
            return false;
        }
        if (!guild) {
            this.Logger.log(`[ERROR] Invalid input for guild: ${guild}`, "error");
            return false;
        }
        const role = guild.roles.cache.find(r => r.name.toLowerCase() == name.toLowerCase() || r.id == name);
        if (!role) {
            if (notifyIfNotExists)
            this.Logger.log(`[ERROR] The ${name} role was not found! Please create it.`, "error");
            return false;
        }
        return role;
    },
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();
    
        let target = message.guild.members.cache.get(toFind);
    
        if (!target && message.mentions.members)
            target = message.mentions.members.first();
    
        if (!target && toFind) {
            target = message.guild.members.cache.find(member => member.username === `${member.displayName.toLowerCase().includes(toFind)}`);
        }
    
        if (!target)
            target = message.member;
    
        return target;
    },
    waitForReaction: function (emojis, userid, message) {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(emojis)) emojis = [emojis];
            message.awaitReactions((reaction, user) => emojis.includes(reaction.emoji.name) && user.id == userid, { max: 1 })
                .then(reactions => {
                    resolve(reactions.first());
                })
                .catch(reject)
        })
    },
    waitForResponse: function (userid, channel) {
        return new Promise((resolve, reject) => {
            channel.awaitMessages(m => m.author.id == userid, { max: 1 })
                .then(msgs => {
                    resolve(msgs.first());
                })
                .catch(reject)
        })
    },
    fetch: async function(url, options, type){
        if (typeof options === "undefined") {
            options = {};
            type = "json";
        } else if (typeof options === "string") {
            type = options;
            options = {};
        } else if (typeof type === "undefined") {
            type = "json";
        }
    
        const query = new URLSearchParams(options.query || {});
    
        url = `${url}?${query}`;
    
        const result = await this.fetchURL(url, options);
        if (!result.ok) throw new Error(`${url} - ${result.status}`);
    
        switch (type) {
            case "result": return result;
            case "buffer": return result.buffer();
            case "json": return result.json();
            case "text": return result.text();
            default: throw new Error(`Unknown type ${type}`);
        }
    },
    fetchURL: async function (url, options = {}) {
        options.headers = options.headers ? { ...options.headers, "User-Agent": "DabbzzBot/1.0.0/Production" } : { "User-Agent": "DabbzzBot/1.0.0/Production" };
        try {
          return fetch(url, options, options.type || "json");
        } catch (error) {
          Error.captureStackTrace(error);
          variables.client.emit("error", error);
          throw error;
        }
    },

}