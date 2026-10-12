import type { editor } from "monaco-editor/esm/vs/editor/editor.api";

class PlaceholderContentWidget implements editor.IContentWidget {
    private static readonly ID = "editor.widget.placeholderHint";

    private domNode: HTMLElement | undefined;

    constructor(private readonly placeholder: string, private readonly editor: editor.ICodeEditor) {
        // register a listener for editor code changes
        editor.onDidChangeModelContent(() => this.onDidChangeModelContent());
        // ensure that on initial load the placeholder is shown
        this.onDidChangeModelContent();
    }

    private onDidChangeModelContent(): void {
        if (this.editor.getValue() === "") {
            this.editor.addContentWidget(this);
        } else {
            this.editor.removeContentWidget(this);
        }
    }

    getId(): string {
        return PlaceholderContentWidget.ID;
    }

    getDomNode(): HTMLElement {
        if (!this.domNode) {
            this.domNode = document.createElement("div");
            this.domNode.style.width = "max-content";
            this.domNode.style.pointerEvents = "none";
            this.domNode.textContent = this.placeholder;
            this.domNode.style.fontStyle = "italic";
            this.editor.applyFontInfo(this.domNode);
        }

        return this.domNode;
    }

    getPosition(): editor.IContentWidgetPosition | null {
        return {
            position: { lineNumber: 1, column: 1 },
            preference: [0 as editor.ContentWidgetPositionPreference],
        };
    }

    dispose(): void {
        this.editor.removeContentWidget(this);
    }
}

export default PlaceholderContentWidget;
