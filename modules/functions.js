const fetch = require("node-fetch");

const Utils = require('./utils');
const Embed = Utils.Embed;

module.exports = (client) => {

  client.hasAdvertisment = function (text, ignoreIfInWhitelist = true) {
    if (!text || typeof text !== 'string') {
        console.log(`[ERROR] Invalid input for advertisment: ${name}`);
        return false;
    }
    if (text.includes(client.config.Whitelisted_Websites) && ignoreIfInWhitelist) return false;
    return /(https?:\/\/)?((([A-Z]|[a-z])+)\.(([A-Z]|[a-z])+))+(\/[^\/\s]+)*/.test(text);
  }

  client.setupEmbed = function (embedSettings) {

    if (embedSettings.configPath) {
        let Title = embedSettings.title || embedSettings.configPath.Title;
        let Description = embedSettings.description || embedSettings.configPath.Description;
        let Footer = embedSettings.footer || embedSettings.configPath.Footer;
        let FooterAvatarImage = embedSettings.footeravatarimage || embedSettings.configPath.Footer_Avatar_Image;
        let Timestamp = embedSettings.timestamp || embedSettings.configPath.Timestamp;
        let Thumbnail = embedSettings.thumbnail || embedSettings.configPath.Thumbnail;
        let Author = embedSettings.author || embedSettings.configPath.Author;
        let AuthorAvatarImage = embedSettings.authoravatarimage || embedSettings.configPath.Author_Avatar_Image
        let Color = embedSettings.color || embedSettings.configPath.Color || this.variables.config.Theme_Color;
        let Variables = embedSettings.variables;
        let Fields = embedSettings.fields || embedSettings.configPath.Fields;
        let Image = embedSettings.image || embedSettings.configPath.Image;
        let fields = [];

        if (typeof Color === 'object') Color = Color[Math.floor(Math.random() * Color.length)];
        if (typeof Description === 'object') Description = Description[Math.floor(Math.random() * Description.length)];

        if (Variables && typeof Variables === 'object') {
            Variables.forEach(v => {
                if (typeof Title === 'string') Title = Title.replace(v.searchFor, v.replaceWith);
                if (typeof Description === 'string') Description = Description.replace(v.searchFor, v.replaceWith);
                if (typeof Footer === 'string') Footer = Footer.replace(v.searchFor, v.replaceWith);
                if (typeof FooterAvatarImage === 'string') FooterAvatarImage = FooterAvatarImage.replace(v.searchFor, v.replaceWith);
                if (typeof Thumbnail === 'string') Thumbnail = Thumbnail.replace(v.searchFor, v.replaceWith);
                if (typeof Author === 'string') Author = Author.replace(v.searchFor, v.replaceWith);
                if (typeof AuthorAvatarImage === 'string') AuthorAvatarImage = AuthorAvatarImage.replace(v.searchFor, v.replaceWith);
                if (typeof Image === 'string') Image = Image.replace(v.searchFor, v.replaceWith);
            })
            if (Fields) {
                Object.keys(Fields).forEach(key => {
                    let value = Object.values(Fields)[Object.keys(Fields).indexOf(key)];
                    let newKey = key;
                    let newValue = value;

                    Variables.forEach(v => {
                        newKey = newKey.replace(v.searchFor, v.replaceWith);
                        newValue = newValue.replace(v.searchFor, v.replaceWith);
                    })

                    fields.push({
                        "name": newKey,
                        "value": newValue
                    })
                });
            }
        }

        let embed = new this.Discord.RichEmbed()

        if (!Title && !Author && !Description) {
            embed.setTitle('Error')
            embed.setDescription('Not enough embed settings provided to build embed')
            return embed;
        }

        if (Title) embed.setTitle(Title);
        if (Author) embed.setAuthor(Author);
        if (Description) embed.setDescription(Description);
        if (Color) embed.setColor(Color)
        if (Footer) embed.setFooter(Footer);
        if (Timestamp == true) embed.setTimestamp();
        if (Timestamp && Timestamp !== true && new Date(Timestamp)) embed.setTimestamp(new Date(Timestamp));
        if (FooterAvatarImage && Footer) embed.setFooter(Footer, FooterAvatarImage);
        if (AuthorAvatarImage && Author) embed.setAuthor(Author, AuthorAvatarImage);
        if (Thumbnail) embed.setThumbnail(Thumbnail);
        if (Fields) {
            fields.forEach(field => {
                embed.addField(field.name, field.value)
            })
        }
        if (Image) embed.setImage(Image);

        return embed;
    } else {
        return console.log('[ERROR] [Utils.setUpEmbed] Invalid input for setting: embedSettings.configPath');
    }
  }
  
  // get the last image posted from a channel
  client.lastImageGet = (channelId) => {
    return (typeof lastAttachmentUrl[channelId] !== 'undefined') ? lastAttachmentUrl[channelId] : null;
  };

  // fetch and set the last image posted from a channel
  client.lastImageSet = (msg) => {
    // get the first image url from a message
    let url = /https?:\/\/.*\.(?:png|jpg|gif|jpeg)/g.exec(msg.content);
    if (url && url[0]) {
      lastAttachmentUrl[msg.channel.id] = url[0];
    }
    // get direct attachment
    else if (typeof msg.attachments.first() !== 'undefined' && msg.attachments.first()) {
      lastAttachmentUrl[msg.channel.id] = msg.attachments.first().url;
    }
  };


  client.formatDate = function(date) {
    return new Intl.DateTimeFormat('en-US').format(date)
  }

  client.promptMessage = async function (message, author, time, validReactions) {
      // We put in the time as seconds, with this it's being transfered to MS
      time *= 1000;

      // For every emoji in the function parameters, react in the good order.
      for (const reaction of validReactions) await message.react(reaction);

      // Only allow reactions from the author,
      // and the emoji must be in the array we provided.
      const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

      // And ofcourse, await the reactions
      return message
          .awaitReactions(filter, { max: 1, time: time})
          .then(collected => collected.first() && collected.first().emoji.name);
  }

  /*
  PERMISSION LEVEL FUNCTION
  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!
  */
  client.permlevel = message => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };

  /*
  SINGLE-LINE AWAITMESSAGE
  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...
  USAGE
  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);
  */
 client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };



};