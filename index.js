

const Discord = require("discord.js");
const Utils = require('./modules/utils');
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const client = new Discord.Client({ autoReconnect: true,
restRequestTimeout: 25000,
retryLimit: 5,
partials: ['MESSAGE', 'REACTION'] });
const variables = Utils.Variables;

// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.
require("./modules/functions.js")(client);

// Here we load the config file that contains our token and our prefix values.
client.config = require("./config.js");
// client.config.token contains the bot's token
// client.config.prefix contains the message prefix

client.muted = require('./data/muted.json');


client.wait = require('util').promisify(setTimeout);

// Aliases and commands are put in collections where they can be read from,
// catalogued, listed, etc.
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// `await client.wait(1000);` to "pause" for 1 second.
client.wait = require("util").promisify(setTimeout);

const database = require(`./modules/data`);
const logger = require('./modules/Logger')
database.setup();

//Set variables used widely around the bot.
variables.set('config', client.config);
variables.set('client', client);
variables.set('database', database)
variables.set(`logger`, logger);

async function init(){

  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
  const cmdFiles = await readdir("./commands/");
  Utils.Logger.log(`Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = Utils.loadCommand(f);
    if (response) Utils.Logger.log(response, "error");
  });

  // Then we load events, which will include our message and ready event.
  const evtFiles = await readdir("./events/");
  Utils.Logger.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    Utils.Logger.log(`Loading Event: ${eventName}`);
    const event = require(`./events/${file}`);
    // Bind the client to any event, before the existing arguments
    // provided by the discord.js event. 
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
  });

  client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
      const thisLevel = client.config.permLevels[i];
      client.levelCache[thisLevel.name] = thisLevel.level;
    }


  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */
  
  // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
  // later, this conflicts with native code. Also, if some other lib you use does
  // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
  // are, we feel, very useful in code. 
  
  // <String>.toPropercase() returns a proper-cased string such as: 
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  Object.defineProperty(String.prototype, "toProperCase", {
    value: function() {
      return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
  });

  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Object.defineProperty(Array.prototype, "random", {
    value: function() {
      return this[Math.floor(Math.random() * this.length)];
    }
  });


  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    Utils.Logger.log(`Uncaught Exception: ${errorMsg}`, "error");
    console.error(err);
    // Always best practice to let the code crash on uncaught exceptions. 
    // Because you should be catching them anyway.
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    Utils.Logger.log(`Unhandled rejection: ${err}`, "error");
    console.error(err);
  });

  // Here we login the client.
  client.login(`NjczOTA5MjE3NTE3ODk1Njgx.XpndkA.sTzf-STiBzpzarApFFrsRL51NS8`);
  variables.set('client', client);

  
  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', (input) => {
    if (input == 'stop') {
      console.log('Bot shutting down...');
      process.exit();
    }

    if (input == 'status') {
      const guild = client.guilds.resolveID(`704194297943294042`);
      const mem = guild.members.fetch()

      console.log(`${guild} , ${mem.length} users`);
    }
  });
}


init(); // dirty hack to make await work. TODO: Do it better.
