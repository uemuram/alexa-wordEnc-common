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

    // レターペアから対応する単語を取り出す
    getWordFromLetterPair(letter1, letter2, kanas) {
        let idx1 = kanas.indexOf(letter1);
        let idx2 = kanas.indexOf(letter2);
        let wordIdx = idx1 * kanas.length + idx2;
        return c.wordList[wordIdx];
    }

    // 指定されたメッセージを暗号化する
    encrypt(key, message) {
        console.log("<暗号化実施> [鍵:" + key + "][メッセージ:" + message + "]");

        // ランダム要素を入れるためのランダムキーを発行
        let key2 = Math.floor(Math.random() * c.wordList.length);
        console.log("固有キー:" + key2 + "(" + c.wordList[key2] + ")");

        // 利用するかな一覧を、鍵を利用してシャッフルして配列に入れる。
        // その際終端文字(☆)も追加する
        let kanas = this.shuffle(key + key2, c.kanaList.concat(['☆']));
        console.log("シャッフル後かな一覧 :" + kanas);

        // メッセージの一番最後に終端文字を付ける。
        // ただし、全体が偶数になるように必要なら最後に一文字加える
        message += '☆';
        if (message.length % 2 == 1) {
            message += c.kanaList[Math.floor(Math.random() * c.kanaList.length)]
        }
        console.log("暗号化直前メッセージ:" + message);

        // 暗号化実施
        // 最初の一つは固有キー
        let encryptWords = [c.wordList[key2]];
        for (let i = 0; i < message.length; i += 2) {
            let encryptWord = this.getWordFromLetterPair(message[i], message[i + 1], kanas);
            console.log("単語生成:" + message[i] + message[i + 1] + "->" + encryptWord);
            encryptWords = encryptWords.concat(encryptWord);
        }
        return encryptWords;
    }
}

module.exports = CommonUtil;