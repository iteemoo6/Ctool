import {StorageInterface, StorageDataStructure, StorageDataStructureInterface} from '@/types'

interface StorageArea {
    readonly length: number
    key(index: number): string | null
    getItem(key: string): string | null
    setItem(key: string, value: string): void
    removeItem(key: string): void
    clear(): void
}

const createMemoryStorage = (): StorageArea => {
    const items = new Map<string, string>()
    return {
        get length() {
            return items.size
        },
        key: (index: number) => Array.from(items.keys())[index] ?? null,
        getItem: (key: string) => items.get(key) ?? null,
        setItem: (key: string, value: string) => items.set(key, value),
        removeItem: (key: string) => items.delete(key),
        clear: () => items.clear(),
    }
}

const getStorageArea = (): StorageArea => {
    try {
        const testKey = "__ctool_storage_test__"
        localStorage.setItem(testKey, "1")
        localStorage.removeItem(testKey)
        return localStorage
    } catch (e) {
        return createMemoryStorage()
    }
}

const area = getStorageArea()
const namespace = "ctool."
const fullKey = (key: string) => `${namespace}${key}`
const decode = (value: string | null) => {
    if (value === null) {
        return null
    }
    try {
        return JSON.parse(value)
    } catch (e) {
        return value
    }
}

class storage implements StorageInterface {
    get<T>(key: string): StorageDataStructure<T> {
        return decode(area.getItem(fullKey(key)))
    }

    clear(): void {
        this.getAllKey().forEach(key => area.removeItem(fullKey(key)))
    }

    getAllKey(): string[] {
        const keys: string[] = []
        for (let index = 0; index < area.length; index++) {
            const key = area.key(index)
            if (key !== null && key.startsWith(namespace)) {
                keys.push(key.slice(namespace.length))
            }
        }
        return keys
    }

    remove(key: string): void {
        area.removeItem(fullKey(key))
    }

    set<T>(key: string, value: StorageDataStructureInterface<T>): void {
        area.setItem(fullKey(key), JSON.stringify(value))
    }
}

export default new storage()
