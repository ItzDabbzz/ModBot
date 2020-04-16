const sqlite = require("better-sqlite3");

let db = new sqlite("ModBot.sqlite");

//let getreports = db.prepare("SELECT * FROM punishments");


exports.init = async function () {
    const tableCheck = db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='punishments';").get();

    if(tableCheck["count(*)"]) { return console.log("SQLite Database exists! Skipping creation step..."); } //Prevent crashing if SQLite database exists already

    db.prepare("CREATE TABLE punishments (id INTEGER, userID TEXT, reportedby TEXT, reason TEXT)").run();
    db.prepare("CREATE TABLE users (userID TEXT, xp INTEGER, level INTEGER)").run();
}

exports.add = async function (id, userID, reportedBy, reason) {
    console.log(` ${id} | ${userID} | ${reportedBy} | ${reason}`)
    db.prepare("INSERT INTO punishments (id, userID, reportedby, reason) VALUES (?, ?, ?, ?)").run(id, userID, reportedBy.id, reason);
}

exports.selectUser = async function (userID) {
    return db.prepare("SELECT * FROM punishments WHERE userID=?").all(userID);
}

exports.getReportsNum = async function (userID) {
    return db.prepare("SELECT * FROM punishments WHERE userID=?").all(userID).length;
}

exports.delete = async function async (id) {
    db.prepare("DELETE FROM punishments WHERE id=?").run(id);
}

exports.reportsEmbed = async function(client, message, args) {
    let embed = client.embed({
        title: 'Reports',
        fields: [{
            name: `ID`,
            value: `Info`
        }],
        timestamp: new Date(),
        color: 'RANDOM',
        author: message.author.id,
        footer: `ID: ${args[0]}`
    })

    for (const report of getreports.iterate()){
        if(report.userID == args[0]){
          embed.embed.fields.push({ name: `${report.id}`, value: `User: <@${report.userID}> \n Reported By: <@${report.reportedby}> \nReason: ${report.reason}`, inline: true});
        }
    }
    
    await message.channel.send(embed);
}