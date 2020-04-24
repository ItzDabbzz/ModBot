let Utils = require('./utils');
let vars = Utils.Variables;
const sqlite = require("better-sqlite3");
const Embed = require('../modules/embed');
let db = new sqlite("ModBot.sqlite");

module.exports = {
    sqlite: {

    },
    setup: async function() {
        return new Promise(async (resolve, reject) => {
            try{
                
                require.resolve('sqlite3');
                this.sqlite.module = require('sqlite3');
                const db = new this.sqlite.module.Database('ModBot.sqlite');

                this.sqlite.database = db;

                //const tableCheck = db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='punishments';").get();
                //if(tableCheck["count(*)"]) { return console.log("SQLite Database exists! Skipping creation step..."); } //Prevent crashing if SQLite database exists already
                db.prepare('CREATE TABLE IF NOT EXISTS modlog(name text, enabled text)').run();
                //db.prepare('CREATE TABLE IF NOT EXISTS coins(user text, guild text, coins integer)').run();
                //db.prepare('CREATE TABLE IF NOT EXISTS dailycoinscooldown (user text, guild text, date text)').run();
                //db.prepare('CREATE TABLE IF NOT EXISTS experience(user text, guild text, level integer, xp integer)').run();
                db.prepare("CREATE TABLE IF NOT EXISTS punishments (type TEXT, user TEXT, reason TEXT, time INTEGER,  executor TEXT)").run();
                db.prepare("CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY AUTOINCREMENT, userID TEXT, reportedby TEXT, reason TEXT)").run();

                db.prepare('CREATE TABLE IF NOT EXISTS tickets(guild text, channel_id text, channel_name text, creator text, reason text, username text)').run();
                db.prepare('CREATE TABLE IF NOT EXISTS ticketsaddedusers(user text, ticket text)').run();
                db.prepare('CREATE TABLE IF NOT EXISTS ticketmessages (message text, author text, authorAvatar text, authorTag text, created_at integer, embed_title text, embed_description text, embed_color text, attachment text, content text, ticket text)').run()
                db.prepare('CREATE TABLE IF NOT EXISTS ticketmessages_embed_fields (message text, name text, value text)').run()
                
                
            }catch (err) {
                        console.log(err);
                        reject('[ERROR] SQLite3 is not installed. Install it with npm install better-sqlite3. Bot will shut down.');
                        console.log('[ERROR] SQLite3 is not installed. Install it with npm install better-sqlite3. Bot will shut down.');
                        process.exit();
            }
        })
    },
    get: {
        getModLog(name) {
            if(name){
                return new Promise((resolve, reject) => {
                    module.exports.sqlite.database.all('SELECT * FROM modlog where name=?', [name], function (err, modlog) {
                        if (err) return reject(err);
                        resolve(modlog[0].enabled);
                    })
                })
            }
        },
        getCoins(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) reject('User is not a member.');
                    
                    module.exports.sqlite.database.all('SELECT * FROM coins WHERE user=? AND guild=?', [user.id, user.guild.id], function (err, coins) {
                        if (err) reject(err);
                        if (coins.length < 1) {
                            coins[0] = { user: user.id, guild: user.guild.id, coins: 0 };
                            module.exports.update.coins.setUserCoins(user, 0)
                                .then(() => {
                                    resolve(coins[0].coins);
                                });
                        }
                        else resolve(coins[0].coins);
                    })
                }else{
                    module.exports.sqlite.database.all('SELECT * FROM coins', function (err, coins) {
                        if (err) reject(err);
                        resolve(coins);
                    })
                }

            })
        },
        getExperience(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) reject('User is not a member.');

                    module.exports.sqlite.database.all('SELECT * FROM experience WHERE user=? AND guild=?', [user.id, user.guild.id], function (err, experience) {
                        if (err) reject(err);
                        if (experience.length < 1) {
                            experience[0] = { level: 1, xp: 0 };
                            module.exports.experience.updateExperience(user, 1, 0)
                                .then(() => {
                                    resolve(experience[0]);
                                });
                        }
                        else resolve(experience[0]);
                    })
                } else {

                    module.exports.sqlite.database.all('SELECT * FROM experience', function (err, experience) {
                        if (err) reject(err);
                        resolve(experience);
                    })

                }
            })
        },
        getPunishments(id) {
            return new Promise((resolve, reject) => {
                if (id) {
                    module.exports.sqlite.database.all('SELECT * FROM punishments WHERE user=?', [id], function (err, rows) {
                        if (err) reject(err);
                        else resolve(rows);
                    })
                }else{
                    module.exports.sqlite.database.all('SELECT * FROM punishments', function (err, rows) {
                        if (err) reject(err);
                        else resolve(rows);
                    })
                }
            })
        },
        getPunishmentsForUser(user) {
            return new Promise((resolve, reject) => {
                module.exports.sqlite.database.all('SELECT type FROM punishments WHERE type=? AND user=?', [`mute`, user], function (err, punishments) {
                    if (err) return reject(err);
                    resolve(punishments);
                })
            })
        },
        getPunishmentID() {
            return new Promise((resolve, reject) => {
                module.exports.sqlite.database.all('SELECT id FROM punishments ORDER BY id DESC LIMIT 1', function (err, punishments) {
                    if (err) return reject(err);
                    resolve(punishments[0].id);
                })
            })
        },
        getWarnings(user) {
            return new Promise((resolve, reject) => {
                if (user && user.id) {
                    module.exports.sqlite.database.all('SELECT * FROM warnings WHERE user=?', [user.id], function (err, warnings) {
                        if (err) reject(err);
                        else resolve(warnings);
                        })
                } else {
                    module.exports.sqlite.database.all('SELECT * FROM warnings', function (err, warnings) {
                        if (err) reject(err);
                        else resolve(warnings);
                    })
                }
            })
        },
        getReports(id) {
            return new Promise((resolve, reject) => {
                if(id){
                    module.exports.sqlite.database.all('SELECT * FROM reports WHERE userID=?', [id], function (err, reports) {
                        if (err) reject(err);
                        else resolve(reports);
                    })
                }else
                {
                    module.exports.sqlite.database.run('SELECT * FROM reports', function (err, reports) {
                        if (err) reject(err);
                        else resolve(reports[0]);
                    })
                }
            })
        },
        getReportsNum(id){
            return module.exports.sqlite.database.prepare("SELECT * FROM reports WHERE userID=?").all(id).length;
        },
        getMutesNum(id){
            return module.exports.sqlite.database.prepare("SELECT * FROM punishments WHERE user=?").all(id).length;
        }
    },
    coins: {
        setUserCoins(user, newcoins) {
            return new Promise(async (resolve, reject) => {
                if ([user, user.guild].some(t => !t)) reject('Invalid parameters in setUserCoins');

                module.exports.sqlite.database.all('SELECT * FROM coins WHERE user=? AND guild=?', [user.id, user.guild.id], function (err, coins) {
                    if (err) reject(err);
                    if (coins.length > 0) {
                        module.exports.sqlite.database.run('UPDATE coins SET coins=? WHERE user=? AND guild=?', [newcoins, user.id, user.guild.id], function (err) {
                            if (err) reject(err);
                            resolve();
                        })
                    } else {
                        module.exports.sqlite.database.run('INSERT INTO coins(user, guild, coins) VALUES(?, ?, ?)', [user.id, user.guild.id, newcoins], function (err) {
                            if (err) reject(err);
                            resolve();
                        })
                    }
                })
            })
        },
        setNextDailyCoinsTime(user, date) {
            return new Promise(async (resolve, reject) => {
                if ([user, user.guild, date].some(t => !t)) reject('Invalid parameters in setNextDailyCoinsTime');

                module.exports.sqlite.database.all('SELECT * FROM dailycoinscooldown WHERE user=? AND guild=?', [user.id, user.guild.id], function (err, rows) {
                    if (err) reject(err);
                    if(rows.length > 0) {
                    module.exports.sqlite.database.run('UPDATE dailycoinscooldown SET date=? WHERE user=? AND guild=?', [date, user.id, user.guild.id], function (err) {
                        if (err) reject(err);
                        resolve();
                    })
                } else {
                    module.exports.sqlite.database.run('INSERT INTO dailycoinscooldown(user, guild, date) VALUES(?,?,?)', [user.id, user.guild.id, date], function (err) {
                        if (err) reject(err);
                        resolve()
                    })
                }
                })
            })
        }
    },
    experience: {
        updateExperience(user, level, xp) {
            return new Promise(async (resolve, reject) => {
                if ([user, user.guild].some(t => !t) || isNaN(level) || isNaN(xp)) reject('Invalid parameters in updateExperience');

                module.exports.sqlite.database.all('SELECT * FROM experience WHERE user=? AND guild=?', [user.id, user.guild.id], function (err, experience) {
                    if (err) reject(err);
                    if (experience.length > 0) {
                        module.exports.sqlite.database.run('UPDATE experience SET level=?, xp=? WHERE user=? AND guild=?', [level, xp, user.id, user.guild.id], function (err) {
                            if (err) reject(err);
                            resolve();
                        })
                    } else {
                        module.exports.sqlite.database.run('INSERT INTO experience(user, guild, level, xp) VALUES(?, ?, ?, ?)', [user.id, user.guild.id, level, xp], function (err) {
                            if (err) reject(err);
                            resolve();
                        })
                    }
                })
            })
        }
    },
    tickets: {
        addedUsers: {
            remove(ticket, userid) {
                if (!userid) return console.log('[Database.js#addedUsers#remove] Invalid inputs');
                return new Promise((resolve, reject) => {
                    module.exports.sqlite.database.run('DELETE FROM ticketsaddedusers WHERE ticket=? AND user=?', [ticket, userid], function (err) {
                        if (err) reject(err);
                        resolve();
                    })
                })
            },
            add(ticket, userid) {
                if (Object.values(arguments).some(a => !a)) return console.log('[Database.js#addedUsers#add] Invalid inputs');
                return new Promise((resolve, reject) => {
                    module.exports.sqlite.database.run('INSERT INTO ticketsaddedusers(user, ticket) VALUES(?, ?)', [userid, ticket], function (err) {
                        if (err) reject(err);
                        resolve();
                    })
                })
            }
        },
        createTicket(data) {
            if (Object.values(arguments).some(a => !a)) return console.log('[Database.js#createTicket] Invalid inputs');
            return new Promise((resolve, reject) => {
                module.exports.sqlite.database.run('INSERT INTO tickets(guild, channel_id, channel_name, creator, reason, username) VALUES(?, ?, ?, ?, ?, ?)', [data.guild, data.channel_id, data.channel_name, data.creator, data.reason, data.username], function (err) {
                    if (err) reject(err);
                    resolve();
                })

            })
        },
        removeTicket(id) {
            if (Object.values(arguments).some(a => !a)) return console.log('[Database.js#removeTicket] Invalid inputs');
            return new Promise((resolve, reject) => {
                module.exports.sqlite.database.run('DELETE FROM tickets WHERE channel_id=?', [id], function (err) {
                    if (err) reject(err);
                    resolve();
                })
            })
        },
        ticket_messages: {
            getMessages(ticket) {
                return new Promise((resolve, reject) => {
                    if (!ticket) reject('Invalid ticket');
                    module.exports.sqlite.database.all('SELECT * FROM ticketmessages WHERE ticket=?', [ticket], function (err, messages) {
                        if (err) reject(err);
                        resolve(messages);
                    })
                })
            },
            getEmbedFields(messageID) {
                return new Promise((resolve, reject) => {
                    if (!messageID) reject('Invalid messageID');
                    module.exports.sqlite.database.all('SELECT * FROM ticketmessages_embed_fields WHERE message=?', [messageID], function (err, fields) {
                        if (err) reject(err);
                        resolve(fields);
                    })
                })
            }
        },
        getTickets(id) {
            return new Promise((resolve, reject) => {
                if (id) {
                    module.exports.sqlite.database.all('SELECT * FROM tickets WHERE channel_id=?', [id], function (err, tickets) {
                        if (err) reject(err);
                        else resolve(tickets[0])
                    })

                } else {

                    module.exports.sqlite.database.all('SELECT * FROM tickets', function (err, tickets) {
                        if (err) reject(err);
                        else resolve(tickets);
                    })
                }
            })
        },
        getTicketsUser(id) {
            return new Promise((resolve, reject) => {
                module.exports.sqlite.database.all('SELECT * FROM tickets WHERE channel_id=?', [id], function (err, tickets) {
                    if (err) reject(err);
                    resolve(tickets)
                })
            })
        },
        getAddedUsers(ticket) {
            return new Promise((resolve, reject) => {
                if (ticket) {
                    // SQLITE
                    module.exports.sqlite.database.all('SELECT * FROM ticketsaddedusers WHERE ticket=?', [ticket], function (err, addedusers) {
                        if (err) reject(err);
                        resolve(addedusers)
                    })
                } else {

                    // SQLITE
                    module.exports.sqlite.database.all('SELECT * FROM ticketsaddedusers', function (err, addedusers) {
                        if (err) reject(err);
                        resolve(addedusers);
                    })
                }
            })
        },
    },
    punishments: {
        addPunishment(data) {
            return new Promise((resolve, reject) => {
                if (['type', 'user', 'reason', 'time', 'executor'].some(a => !data[a])) return reject('Invalid arguments for addPunishment');
                module.exports.sqlite.database.run('INSERT INTO punishments(type, user, reason, time, executor) VALUES(?, ?, ?, ?, ?)', [data.type, data.user, data.reason, data.time, data.executor], function (err) {
                    if (err) reject(err);
                    else resolve();
                })
            })
        },
        removePunishment(id) {
            return new Promise((resolve, reject) => {
                module.exports.sqlite.database.run('DELETE FROM punishments WHERE id=?', [id], function (err) {
                    if (err) reject(err);
                    else resolve();
                })
            })
        },
        addWarning(data) {
            return new Promise((resolve, reject) => {
                if (['user', 'reason', 'time', 'executor'].some(a => !data[a])) return reject('Invalid arguments for addWarning');

                module.exports.sqlite.database.run('INSERT INTO warnings(user, reason, time, executor) VALUES(?, ?, ?, ?, ?)', [data.user, data.reason, data.time, data.executor], function (err) {
                    if (err) reject(err);
                    else resolve();
                })
            })
        },
        removeWarning(id) {
            return new Promise((resolve, reject) => {
                module.exports.sqlite.database.run('DELETE FROM warnings WHERE id=?', [id], function (err) {
                    if (err) reject(err);
                    else resolve(err);
                })
            })
        },
        addReport(id, userId, reportedBy, reason) {
            console.log(`Report Added: ${userId} | ${reportedBy} | ${reason}`)
            db.prepare("INSERT INTO reports (id, userID, reportedby, reason) VALUES (?, ?, ?, ?)").run(id, userId, reportedBy, reason);
        },
        async reportsEmbed(message, args) {

            let target = message.guild.members.cache.get(args[0]);
        
            if (!target && message.mentions.members)
                target = message.mentions.members.first();
        
            if (!target && toFind) {
                target = message.guild.members.cache.find(member => member.username === `${member.displayName.toLowerCase().includes(toFind)}`);
            }
        
            if (!target)
                target = message.member;

            const mem = target.id
            const reports = await module.exports.get.getReports(mem)
        
            if(!reports || reports.length == 0) return message.channel.send(Embed({preset:`error`, description:`No Reports Were Found`}));
            
            let embed = Embed({
                title: 'Reports',
                description: reports.map(reports => `User: <@${reports.userID}> \n Reported By: <@${reports.reportedby}> \nReason: ${reports.reason} `).join(`\n\n`),
                timestamp: new Date(),
                color: 'RANDOM',
                footer: `ID: ${args[0]}`
            });

            await message.channel.send(embed);
        },
        async punishmentsEmbed(message, args) {

            let target = message.guild.members.cache.get(args[0]);
        
            if (!target && message.mentions.members)
                target = message.mentions.members.first();
        
            if (!target && toFind) {
                target = message.guild.members.cache.find(member => member.username === `${member.displayName.toLowerCase().includes(toFind)}`);
            }
        
            if (!target)
                target = message.member;

            const mem = target.id
            const punishments = await module.exports.get.getPunishments(mem)

            if(!punishments || punishments.length == 0) return message.channel.send(Embed({preset:`error`, description:`No Punishments Were Found`}));

            let embed = Embed({
                title: 'Punishments',
                description: punishments.map(punis => `Type: ${punis.type} \n User: <@${punis.user}> \n Reported By: <@${punis.executor}> \n Reason: ${punis.reason} `).join(`\n\n`),
                timestamp: new Date(),
                color: 'RANDOM',
                footer: `ID: ${args[0]}`
            })

            await message.channel.send(embed);
        }
    }
}