let Utils = {};
const sqlite = require("better-sqlite3");

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
                db.prepare('CREATE TABLE IF NOT EXISTS coins(user text, guild text, coins integer)').run();
                db.prepare('CREATE TABLE IF NOT EXISTS dailycoinscooldown (user text, guild text, date text)').run();
                db.prepare('CREATE TABLE IF NOT EXISTS experience(user text, guild text, level integer, xp integer)').run();
                db.prepare("CREATE TABLE IF NOT EXISTS punishments (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, userID TEXT, reportedby TEXT, reason TEXT, time INTEGER)").run();
                db.prepare('CREATE TABLE IF NOT EXISTS warnings (id INTEGER PRIMARY KEY AUTOINCREMENT, user text, tag text, reason text, time integer, executor text)').run();
                
            }catch (err) {
                        console.log(err);
                        reject('[ERROR] SQLite3 is not installed. Install it with npm install better-sqlite3. Bot will shut down.');
                        console.log('[ERROR] SQLite3 is not installed. Install it with npm install better-sqlite3. Bot will shut down.');
                        process.exit();
            }
        })
    },
    get: {
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
                    module.exports.sqlite.database.all('SELECT * FROM punishments WHERE id=?', [id], function (err, rows) {
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
                module.exports.sqlite.database.all('SELECT * FROM punishments WHERE user=?', [user], function (err, rows) {
                    if (err) reject(err);
                    else resolve(rows);
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
        getWarning(id) {
            return new Promise((resolve, reject) => {
                module.exports.sqlite.database.all('SELECT * FROM warnings WHERE id=?', [id], function (err, warnings) {
                    if (err) reject(err);
                    else resolve(warnings[0]);
                })
            })
        },
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
    }
}