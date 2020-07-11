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

    // 単語インデックスから対応するレターペアを取り出す
    getLetterPairFromWordId(wordId, kanas) {
        let idx1 = Math.floor(wordId / kanas.length);
        let idx2 = wordId % kanas.length;
        return kanas[idx1] + kanas[idx2];
    }

    // 単語のIDより、内部キーと単語の数を求める
    getInnerKeyAndTotalWordCount(wordId) {
        let innerKey = Math.floor(wordId / c.ENCRYPT_WORD_NUM_LIMIT);
        let totalWordCount = wordId % c.ENCRYPT_WORD_NUM_LIMIT + 1;
        return { "innerKey": innerKey, "totalWordCount": totalWordCount }
    }

    // 指定されたメッセージを暗号化する
    encrypt(key, message) {
        console.log("<暗号化実施> [鍵:" + key + "][メッセージ:" + message + "]");

        // メッセージを暗号化するのに必要な単語の数(メッセージ長/2)
        let wordCount = Math.ceil(message.length / 2);

        // ランダム要素を入れるためのランダムキー(内部キー)を発行
        let keyNum = Math.floor(c.wordList.length / c.ENCRYPT_WORD_NUM_LIMIT);
        let innerKey = Math.floor(Math.random() * keyNum);

        // 内部キーとメッセージ長によって決まる単語
        let innerKeyIdx = innerKey * c.ENCRYPT_WORD_NUM_LIMIT + wordCount;
        let innerKeyWord = c.wordList[innerKeyIdx];
        console.log("内部キー:" + innerKey);
        console.log("内部キーと長さ保存用単語:" + innerKeyWord + "(" + innerKeyIdx + ")")

        // 利用するかな一覧を、鍵を利用してシャッフルして配列に入れる。
        // その際調整用文字(☆)も追加する
        let kanas = this.shuffle(key + innerKey, c.kanaList.concat(['☆']));
        console.log("シャッフル後かな一覧 :" + kanas);

        // 全体が偶数になるように必要なら最後に調整用文字を加える
        if (message.length % 2 == 1) {
            message += '☆'
        }
        console.log("暗号化直前メッセージ:" + message);

        // 暗号化実施
        // 最初の一つは固有キー
        let encryptWords = [innerKeyWord];
        for (let i = 0; i < message.length; i += 2) {
            let encryptWord = this.getWordFromLetterPair(message[i], message[i + 1], kanas);
            console.log("単語生成:" + message[i] + message[i + 1] + "->" + encryptWord);
            encryptWords = encryptWords.concat(encryptWord);
        }
        return encryptWords;
    }

    // メッセージを複合化する
    decrypt(key, wordIds) {
        console.log("<複合化実施> [鍵:" + key + "][単語ID:" + wordIds + "]");

        // 1つ目の単語を使って内部キーを抽出する
        let innerKey = this.getInnerKeyAndTotalWordCount(wordIds[0]).innerKey;
        console.log("内部キー:" + innerKey);

        // 利用するかな一覧を、鍵を利用してシャッフルして配列に入れる。(暗号化時と同じロジックを使用)
        // その際調整用文字(☆)も追加する
        let kanas = this.shuffle(key + innerKey, c.kanaList.concat(['☆']));
        console.log("シャッフル後かな一覧 :" + kanas);

        // 複合化実施
        let decryptMessage = "";
        for (let i = 1; i < wordIds.length; i++) {
            let wordId = wordIds[i];
            let letterPair = this.getLetterPairFromWordId(wordId, kanas);
            console.log("解読:" + wordId + "(" + c.wordList[wordId] + ")->" + letterPair);
            decryptMessage += letterPair;
        }
        console.log("解読済みメッセージ:" + decryptMessage);

        // 末尾が調整用文字(☆)だった場合は除去する
        decryptMessage = decryptMessage.replace(/☆/g, '');
        console.log("解読済みメッセージ(終端文字除去):" + decryptMessage);

        return decryptMessage;
    }

}

module.exports = CommonUtil;