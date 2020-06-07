const Speech = require('ssml-builder');

class CommonUtil {

    // 状態をチェック
    checkState(h, state) {
        return (this.getState(h) == state);
    }

    //状態を取得
    getState(h) {
        return this.getSessionValue(h, 'STATE');
    }

    //状態を保存
    setState(h, state) {
        this.setSessionValue(h, 'STATE', state);
    }

    // セッションから値を取得
    getSessionValue(h, key) {
        const attr = h.attributesManager.getSessionAttributes();
        return attr[key];
    }

    // セッションに値を入れる
    setSessionValue(h, key, value) {
        let attr = h.attributesManager.getSessionAttributes();
        attr[key] = value
        h.attributesManager.setSessionAttributes(attr);
    }

    // 指定されたメッセージを暗号化する
    encrypt(key, message) {
        console.log("<暗号化実施> [鍵:" + key + "][メッセージ:" + message + "]");
        const Random = require('/opt/Random');
        const random = new Random(key);

        for (let i = 0; i < 10; i++) {
            const value = random.nextInt(1, 10);
            console.log(value);
        }



        return ["aaa", "bbb", "ccc"];
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