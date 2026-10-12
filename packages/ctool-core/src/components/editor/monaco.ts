import loader from "@monaco-editor/loader";
import ContextMenu from "./contextMenu";
import lineInfo from "./lineInfo";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import "./style.css";

type Monaco = typeof import("monaco-editor");

let monacoPromise: Promise<Monaco> | null = null;

const loadMonaco = () => {
    monacoPromise ??= import("monaco-editor").then(monaco => {
        self.MonacoEnvironment = {
            getWorker(_, label) {
                if (label === "json") {
                    return new jsonWorker();
                }
                if (label === "css" || label === "scss" || label === "less") {
                    return new cssWorker();
                }
                if (label === "html" || label === "handlebars" || label === "razor") {
                    return new htmlWorker();
                }
                if (label === "typescript" || label === "javascript") {
                    return new tsWorker();
                }
                return new editorWorker();
            },
        };
        return monaco;
    });
    return monacoPromise;
};

const monacoInstance = () => {
    return loader.__getMonacoInstance();
};

const monacoInit = async (params: Parameters<typeof loader.config>[0] = {}) => {
    const monaco = await loadMonaco();
    // 暂时无法设置 i18n
    // https://github.com/suren-atoyan/monaco-loader/issues/40
    loader.config({
        monaco,
        ...params
    });
    return await loader.init();
};

export { monacoInit, ContextMenu, monacoInstance, lineInfo };
