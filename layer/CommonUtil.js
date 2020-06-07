const Speech = require('ssml-builder');
const Constant = require('/opt/Constant');
const c = new Constant();

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

    // 配列をシャッフルする。ランダム部分は指定されたキーを使う
    shuffle(key, array) {
        const Random = require('/opt/Random');
        const random = new Random(c.RANDOMKEY_ADD_KANA_SHUFFLE + key);
        let newArray = [];
        const array2 = array.concat();

        while (array2.length > 0) {
            let n = array2.length;
            let k = random.nextInt(0, n - 1);
            newArray.push(array2[k]);
            array2.splice(k, 1);
        }
        return newArray;
    }

    // 指定されたメッセージを暗号化する
    encrypt(key, message) {
        console.log("<暗号化実施> [鍵:" + key + "][メッセージ:" + message + "]");

        // 利用するかな一覧を、鍵を利用してシャッフルして配列に入れる
        console.log("シャッフル前かな一覧 :" + c.kanaList);
        let kanas = this.shuffle(key, c.kanaList);
        console.log("シャッフル後かな一覧 :" + kanas);

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