import { PlatformRuntime, Storage, Initializer } from "@/types";
import { runtime as web } from "./platformRuntimeDefault";
import { Router } from "vue-router";

type AdapterName = "edge" | "chrome" | "firefox" | "utools" | "tauri";

const detectAdapter = (): AdapterName | null => {
    const userAgent = navigator.userAgent;
    const globalWindow = window as any;
    const chromeApi = globalWindow.chrome;
    const browserApi = globalWindow.browser;

    if (userAgent.includes("Edg") && !!chromeApi?.tabs) {
        return "edge";
    }
    if (!userAgent.includes("Edg") && userAgent.includes("Chrome") && !!chromeApi?.tabs) {
        return "chrome";
    }
    if (userAgent.includes("Firefox") && !!browserApi?.tabs) {
        return "firefox";
    }
    if (userAgent.includes("uTools")) {
        return "utools";
    }
    if (!!globalWindow.__TAURI__) {
        return "tauri";
    }
    return null;
}

const loadRuntime = async (): Promise<PlatformRuntime> => {
    switch (detectAdapter()) {
        case "edge":
            return (await import("ctool-adapter-edge")).runtime;
        case "chrome":
            return (await import("ctool-adapter-chrome")).runtime;
        case "firefox":
            return (await import("ctool-adapter-firefox")).runtime;
        case "utools":
            return (await import("ctool-adapter-utools")).runtime;
        case "tauri":
            return (await import("ctool-adapter-tauri")).runtime;
        default:
            return web;
    }
}

export default class {
    private platformRuntime: PlatformRuntime = web;
    private readonly loadPromise: Promise<void>;

    constructor() {
        this.loadPromise = this.load();
    }

    ready(): Promise<void> {
        return this.loadPromise;
    }

    private async load(): Promise<void> {
        this.platformRuntime = await loadRuntime();
    }

    name() {
        return this.platformRuntime.name;
    }

    webSecurity() {
        return this.platformRuntime.webSecurity?.() || false;
    }

    openUrl(url: string) {
        return this.platformRuntime.openUrl(url);
    }

    // 平台入口
    initialize(storage: Storage, router: Router) {

        const initializer: Initializer = {
            storage(): Storage {
                return storage;
            },
            push(path: string, query: Record<string, string | number> = {}) {
                void router.push({ path, query });
            },
        };

        this.platformRuntime.initialize?.(initializer);
    }

    get storage() {
        return this.platformRuntime.storage?.() || web.storage();
    }

    call<T = any>(method: string, ...param: any[]): T {
        return this.platformRuntime[method]?.(...param);
    }

    getLocale() {
        return this.platformRuntime.getLocale?.() || web.getLocale();
    }
}
