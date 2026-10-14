import {Transform, Option as TargetOption} from "./type";
import {HistorySerializable} from "@/types";
import {has, isEmpty, merge} from "lodash";

export const languages = [
    "ProtoBuf",
    "PHP",
    "C (cJSON)",
    "C++",
    "Crystal",
    "C#",
    "Dart",
    "Elixir",
    "Elm",
    "Flow",
    "Go",
    "Haskell",
    "Java",
    "JavaScript",
    "JavaScript PropTypes",
    "JSON Schema",
    "Kotlin",
    "Objective-C",
    "Pike",
    "Python",
    "Ruby",
    "Rust",
    "Scala3",
    "Smithy",
    "Swift",
    "TypeScript",
    "TypeScript Effect Schema",
    "TypeScript Zod",
]

const getHandler = async (lang: string): Promise<Transform> => {
    if (lang === "ProtoBuf") {
        return new (await import("./protobuf")).default()
    }
    if (lang === "PHP") {
        return new (await import("./php/")).default()
    }
    const handler = new (await import("./quickType")).default()
    if (handler.getLanguages().includes(lang)) {
        return handler
    }
    throw new Error("Error Lang")
}

export const transform = async (lang: string, input: string, options: Record<string, any>) => {
    return (await getHandler(lang)).execute(lang, input, options);
}

const getDefaultOption = async (handler: Transform, lang: string) => {
    const data: Record<string, any> = {}
    for (let item of handler.getOptionDefine(lang)) {
        data[item.name] = item.defaultValue
    }
    return data
}

export class Option implements HistorySerializable<Option> {
    public __: "_history_serializable_" = "_history_serializable_";

    public lang: string = ""
    public option: Record<string, any> = {}

    constructor(lang: string = "") {
        this.lang = lang;
    }

    async define(): Promise<TargetOption[]> {
        if (this.lang === ""){
            return []
        }
        const handler = await getHandler(this.lang)
        if (!this.option[this.lang]) {
            this.option[this.lang] = await getDefaultOption(handler, this.lang)
        }
        return handler.getOptionDefine(this.lang).sort((a, b) => {
            const index = {
                'string': 1,
                'boolean': 2,
                'select': 3,
            }
            if (a.type === b.type) {
                return 0
            }
            return index[a.type] < index[b.type] ? -1 : 1
        })
    }

    isSaveHistory(): boolean {
        return true;
    }

    serialize(): Record<string, any> {
        const option: Record<string, any> = {}
        if (this.lang in this.option) {
            option[this.lang] = this.option[this.lang]
        }
        return {
            __: this.__,
            lang: this.lang,
            ...(isEmpty(option) ? {} : {option}),
        }
        return {};
    }

    unserialize(data?: Record<string, any>) {
        if (!data) {
            return this;
        }
        const item = new Option()
        if (has(data, 'lang')) {
            item.lang = data.lang
        }
        if (has(data, 'option')) {
            item.option = merge(item.option, data.option)
        }
        return item
    }
}

export const getOption = (lang: string = "") => {
    return new Option(lang)
}

