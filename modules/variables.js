const { log } = require('./Logger');

module.exports = {
    set: function (variable, value, expireAfter = 0) {
        if (variable == 'set') return log('Cannot set variable \'set\'', error);
        this[variable] = value;
        if (expireAfter > 0)
            setTimeout(function () {
                delete this[variable];
            }, expireAfter)
        return value;
    }
}