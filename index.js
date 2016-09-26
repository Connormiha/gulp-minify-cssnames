'use strict';

const Transform = require('readable-stream/transform');
const rs = require('replacestream');
const decToAny = require('decimal-to-any');

const decToAnyOptions = {
    alphabet: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
};

class Replacer {
    constructor(options) {
        let postfix = 'postfix' in options ? options.postfix : '--s--',
            prefix = options.prefix || '';

        this._currentIndex = 0;
        this._namesMap = Object.create(null);

        this.regExp = new RegExp(`${prefix}[\\w_-]+${postfix}`, 'ig');
        this.replace = this.replace.bind(this);
    }

    /**
     * Replaces found substring to number from special alphabet
     * @param {String} str
     * @return {String}
     */
    replace(str) {
        if (!this._namesMap[str]) {
            this._namesMap[str] = `a${decToAny(this._currentIndex, decToAnyOptions.alphabet.length, decToAnyOptions)}`;
            this._currentIndex++;
        }

        return this._namesMap[str];
    }
}

module.exports = (options) => {
    let replacer = new Replacer(options || {});

    return new Transform({
        objectMode: true,
        transform(file, enc, callback) {
            if (file.isStream()) {
                file.contents = file.contents.pipe(rs(replacer.regExp, replacer.replace));
                return callback(null, file);
            }

            if (file.isBuffer()) {
                file.contents = new Buffer(String(file.contents).replace(replacer.regExp, replacer.replace));
                return callback(null, file);
            }

            callback(null, file);
        }
    });
};
