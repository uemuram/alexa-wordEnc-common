class Random {
    // 種を指定して乱数を生成するクラス(XorShiftを利用)
    constructor(seed) {
        this.x = 123456789;
        this.y = 362436069;
        this.z = 521288629;
        // 種として0が指定される場合を想定して加算しておく
        this.w = 100000000 + seed;
    }

    // 次の乱数を生成
    next() {
        let t;

        t = this.x ^ (this.x << 11);
        this.x = this.y; this.y = this.z; this.z = this.w;
        return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
    }

    // min以上max以下の乱数を生成する
    nextInt(min, max) {
        const r = Math.abs(this.next());
        return min + (r % (max + 1 - min));
    }
}

module.exports = Random;