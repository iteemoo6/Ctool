import {InputBase, OutputBase, InputOutputBase, HistorySerializable} from "@/types";
import {isObject} from "lodash";
import rdiff from "recursive-diff";

// 版本号
export const version = document.querySelector('meta[name="ctool-version"]')?.getAttribute('content') || "dev"
// 构建时间
export const buildTimestamp = parseInt(document.querySelector('meta[name="ctool-build-timestamp"]')?.getAttribute('content') || `${Date.parse((new Date()).toString()) / 1000}`)

// uuid
export const uuid = (): string => {
    if (typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    const value = new Uint8Array(16);
    crypto.getRandomValues(value);
    value[6] = (value[6] & 0x0f) | 0x40;
    value[8] = (value[8] & 0x3f) | 0x80;
    const hex = Array.from(value, byte => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// 调试日志
export const debug = (value: any) => {
    console.log(value)
}

export const instanceOfInputOutput = (object: any): object is InputOutputBase => {
    return instanceOfInput(object) || instanceOfOutput(object);
}
export const instanceOfInput = (object: any): object is InputBase => {
    // @ts-ignore
    return isObject(object) && object['_'] === '_input_';
}

export const instanceOfOutput = (object: any): object is OutputBase => {
    // @ts-ignore
    return isObject(object) && object['_'] === '_output_';
}

export const instanceOfHistorySerializable = (object: any): object is HistorySerializable => {
    // @ts-ignore
    return isObject(object) && object['__'] === '_history_serializable_';
}

export const objectInObject = (A: any, B: any) => {
    return rdiff.getDiff(B, A).filter(item => item.op !== "delete").length === 0
}

export const getInArrayOnlyOneItem = (value: string, lists: string[]) => {
    const exist = lists.filter(item => item.includes(value))
    return exist.length === 1 ? exist[0] : ""
}
