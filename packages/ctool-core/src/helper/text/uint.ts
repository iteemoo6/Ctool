// 文本编码类型
import {Buffer} from "buffer";
import chardet from "chardet";
import {Encoding} from "@/helper/text/index";

let gbkEncodeMap: Map<string, Uint8Array> | null = null;

const getGbkEncodeMap = (): Map<string, Uint8Array> => {
    if (gbkEncodeMap === null) {
        const decoder = new TextDecoder("gbk");
        const map = new Map<string, Uint8Array>();
        for (let lead = 0x81; lead <= 0xfe; lead++) {
            for (let trail = 0x40; trail <= 0xfe; trail++) {
                if (trail === 0x7f) {
                    continue;
                }
                const bytes = new Uint8Array([lead, trail]);
                const value = decoder.decode(bytes);
                if (value.length === 1 && value !== "\uFFFD" && !map.has(value)) {
                    map.set(value, bytes);
                }
            }
        }
        gbkEncodeMap = map;
    }
    return gbkEncodeMap;
}

const encodeGbk = (value: string): Uint8Array => {
    const bytes: number[] = [];
    for (let index = 0; index < value.length; index++) {
        const char = value[index];
        const code = char.charCodeAt(0);
        if (code <= 0x7f) {
            bytes.push(code);
            continue;
        }
        const encoded = getGbkEncodeMap().get(char);
        if (encoded === undefined) {
            throw new Error(`GBK encoding unsupported character: ${char}`);
        }
        bytes.push(...encoded);
    }
    return Uint8Array.from(bytes);
}

export default class Uint {
    private readonly _uint8Array: Uint8Array
    private readonly _encoding: Encoding; // 编码标示[参考]

    constructor(uint8Array: Uint8Array, encoding: Encoding = "utf-8") {
        this._encoding = encoding;
        this._uint8Array = uint8Array;
    }

    get length() {
        return this.uint8Array.length
    }

    get uint8Array(): Uint8Array {
        return this._uint8Array;
    }

    get encoding(): Encoding {
        return this._encoding;
    }

    analyseEncoding(): Encoding {
        const analyseEncodings = chardet.analyse(Buffer.from(this.uint8Array)).map(item => item.name)
        if (analyseEncodings.length === 0) {
            return this.encoding
        }

        const Map: Record<string, Encoding> = {
            "GB18030": "gbk",
            "UTF-8": "utf-8"
        }

        for (let item of analyseEncodings) {
            if (item in Map) {
                return Map[item]
            }
        }
        return "utf-8"
    }

    static fromString(str: string) {
        return new Uint((new TextEncoder()).encode(str))
    }

    toString(encoding?: Encoding) {
        return (new TextDecoder(encoding === undefined ? this.encoding : encoding)).decode(this.uint8Array)
    }

    // 编码转换
    to(encoding: Encoding) {
        if (encoding === this.encoding) {
            return this
        }
        const bytes = encoding === 'utf-8' ? new TextEncoder().encode(this.toString()) : encodeGbk(this.toString())
        return new Uint(bytes, encoding)
    }

    localUint8Array() {
        return this.to('utf-8').uint8Array
    }
}
