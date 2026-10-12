import { join, resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import svgLoader from "vite-svg-loader";
import ctoolPlugin from "./vitePlugin";
import { readFileSync } from "fs";
import HtmlConfig from "vite-plugin-html-config";

export default defineConfig({
    base: "./",
    plugins: [
        ctoolPlugin(),
        HtmlConfig({
            metas: [
                {
                    name: "ctool-version",
                    content: JSON.parse(readFileSync(join(__dirname, "../../package.json")).toString())["version"],
                },
                {
                    name: "ctool-build-timestamp",
                    content: `${Date.parse((new Date()).toString()) / 1000}`,
                },
            ],
        }),
        vue(),
        svgLoader({
            defaultImport: "component",
        }),
        VitePWA({
            injectRegister: null,
            registerType: "prompt",
            manifest: false,
            workbox: {
                navigateFallback: "tool.html",
                navigateFallbackDenylist: [
                    /^\/api/,
                    /^\/privacy/,
                ],
                globPatterns: [
                    "index.html",
                    "tool.html",
                    "favicon.ico",
                    "manifest.webmanifest.json",
                    "_assets/*.{js,css}",
                    "assets/tool-*.{js,css}",
                    "icon/*.{png,svg}",
                ],
                runtimeCaching: [
                    {
                        urlPattern: /\/(?:assets|_assets)\//,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "ctool-runtime-assets",
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                            expiration: {
                                maxEntries: 300,
                                maxAgeSeconds: 60 * 60 * 24 * 30,
                            },
                        },
                    },
                ],
                cleanupOutdatedCaches: true,
            },
        }),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    build: {
        assetsDir: "_assets",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
            },
        },
        reportCompressedSize: false,
    },
});
