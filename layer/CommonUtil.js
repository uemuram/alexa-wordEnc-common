const Speech = require('ssml-builder');

module.exports = {
    getHello1: () => {
        return 'test5';
    },
    getHello2: () => {
        return 'test6';
    },
    getSpeech: () => {
        let speech = new Speech()
            .say("なにぬねの")
            .pause('1s')
            .say('はひふへほ');
        return speech.ssml();
    }
};