exports.run = async (client, message, args) => {
        let msgcount = parseInt(args) + 1;
        if (isNaN(msgcount)) {
            return message.reply('Numbers only :1234:');
        }
        if (msgcount < 2) {
            return message.reply('Minimum purge is 2 messages or higher');
        }

        if (msgcount < 150 && msgcount > 100) {
            message.channel.fetchMessages({limit: 100}).then(messages => message.channel.bulkDelete(messages));
            todel = msgcount - 100;
            message.channel.fetchMessages({limit: todel}).then(messages => message.channel.bulkDelete(messages));
            return;
        }
        if (msgcount >= 150 && msgcount <= 1000) {
            let i = 1;
            const x = Math.round(msgcount / 100);
            const y = msgcount / 100;

            while (i <= x) {
                if (i === x) {
                    m = i - 1;
                    m = m * 100;
                    todelete = msgcount - m;
                    message.channel.fetchMessages({limit: todelete}).then(messages => message.channel.bulkDelete(messages));
                } else {
                    message.channel.fetchMessages({limit: 100}).then(messages => message.channel.bulkDelete(messages));
                }
                i++;
            }
        } else {
            message.channel.fetchMessages({limit: msgcount}).then(messages => message.channel.bulkDelete(messages));
        }
    }

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["purge"],
    permLevel: "Moderator"
  };
  
  exports.help = {
    name: "clear",
    category: "Moderation",
    description: "Clears messages in chat",
    usage: "<1-100>"
  };