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
            .say("テスト")
            .pause('1s')
            .say('テストに');
        return speech.ssml();
    }
};