const emoji = require('emoji.json/emoji-compact.json')
const crypto = require('crypto')

class EmojiLogic {
  get count () {
    if (typeof this._count === typeof 0) {
      if (this._count >= this._pass.length - 1) {
        this._count = 0
      } else {
        this._count++
      }
    } else {
      this._count = 0
    }
    return this._count
  }

  _processor (x, decode) {
    if (this._pass) {
      let key = this._pass[this.count]
      this._key = key.charCodeAt(0)
    }
    if (!decode) {
      if (x < emoji.length) {
        let d = x
        if (this._key) {
          d += this._key
        }
        // console.log(x, String.fromCharCode(x), d)
        return emoji[d]
      } else {
        throw new Error(`Emoji Obfuscator Error: ${x} cant handle this char yet`)
      }
    } else {
      x = emoji.indexOf(x)
      let d = x
      if (this._key) {
        d -= this._key
      }
      // console.log(x, String.fromCharCode(d), d)
      return String.fromCharCode(d)
    }
  }

  init (input, pass, decode) {
    if (typeof pass === typeof '') {
      this._pass = crypto.createHmac('sha256', pass)
        .digest('hex')
    }
    if (typeof input === typeof '') {
      let array
      if (!decode) {
        let buffer = Buffer.from(input)
        array = Array.from(buffer)
      } else {
        array = input.split('|')
      }
      return array
        .map(x => this._processor(x, decode))
        .join(decode ? '' : '|')
    }
  }
}

class EmojiObfuscator {
  static _logic (input, pass, decode) {
    return new EmojiLogic()
      .init(input, pass, decode)
  }

  static encode (input, pass) {
    return this._logic(input, pass, false)
  }
  static decode (input, pass) {
    return this._logic(input, pass, true)
  }
}

module.exports = EmojiObfuscator
