const Speech = require('ssml-builder');

class CommonUtil {

    // 状態をチェック
    checkState(h, state) {
        //    const attr = h.attributesManager.getSessionAttributes();
        //    return (attr.STATE == state);
        return (this.getState(h) == state);
    }

    //状態を取得
    getState(h) {
        const attr = h.attributesManager.getSessionAttributes();
        return attr.STATE;
    }

    //状態を保存
    setState(h, state) {
        let attr = h.attributesManager.getSessionAttributes();
        attr.STATE = state
        h.attributesManager.setSessionAttributes(attr);
    }

    getHello1() {
        return 'test5';
    }
    getHello2() {
        return 'test6';
    }
    getSpeech() {
        let speech = new Speech()
            .say("なにぬねの")
            .say(this.getHello2())
            .pause('1s')
            .say('はひふへほ');
        return speech.ssml();
    }

}

module.exports = CommonUtil;