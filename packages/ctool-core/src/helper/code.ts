type LanguageExtensionPoint = {
    id: string;
    aliases?: string[];
};

const language = (id: string, aliases: string[] = []): LanguageExtensionPoint => ({
    id,
    aliases,
});

const supportedLanguages: LanguageExtensionPoint[] = [
    language("plaintext", ["Plain Text", "text"]),
    language("json", ["JSON", "json"]),
    language("abap", ["ABAP", "abap"]),
    language("aes", ["AES", "sophia", "Sophia"]),
    language("apex", ["Apex", "apex"]),
    language("azcli", ["Azure CLI", "azcli"]),
    language("bat", ["Batch", "bat"]),
    language("bicep", ["Bicep"]),
    language("c", ["C", "c"]),
    language("cameligo", ["Cameligo"]),
    language("clojure", ["Clojure", "clojure"]),
    language("coffeescript", ["CoffeeScript", "coffeescript", "coffee"]),
    language("csharp", ["C#", "csharp"]),
    language("csp", ["CSP", "csp"]),
    language("css", ["CSS", "css"]),
    language("cypher", ["Cypher", "OpenCypher"]),
    language("dart", ["Dart", "dart"]),
    language("dockerfile", ["Dockerfile"]),
    language("ecl", ["ECL", "Ecl", "ecl"]),
    language("elixir", ["Elixir", "elixir", "ex"]),
    language("flow9", ["Flow9", "Flow", "flow9", "flow"]),
    language("freemarker2", ["FreeMarker2", "Apache FreeMarker2"]),
    language("fsharp", ["F#", "FSharp", "fsharp"]),
    language("go", ["Go"]),
    language("graphql", ["GraphQL", "graphql", "gql"]),
    language("handlebars", ["Handlebars", "handlebars", "hbs"]),
    language("hcl", ["Terraform", "tf", "HCL", "hcl"]),
    language("html", ["HTML", "htm", "html", "xhtml"]),
    language("ini", ["Ini", "ini"]),
    language("java", ["Java", "java"]),
    language("javascript", ["JavaScript", "javascript", "js"]),
    language("julia", ["Julia", "julia"]),
    language("kotlin", ["Kotlin", "kotlin"]),
    language("less", ["Less", "less"]),
    language("lexon", ["Lexon"]),
    language("liquid", ["Liquid", "liquid"]),
    language("lua", ["Lua", "lua"]),
    language("m3", ["Modula-3", "Modula3", "modula3", "m3"]),
    language("markdown", ["Markdown", "markdown"]),
    language("mdx", ["MDX", "mdx"]),
    language("mips", ["MIPS", "MIPS-V"]),
    language("msdax", ["DAX", "MSDAX"]),
    language("mysql", ["MySQL", "mysql"]),
    language("objective-c", ["Objective-C"]),
    language("pascal", ["Pascal", "pas"]),
    language("pascaligo", ["Pascaligo", "ligo"]),
    language("perl", ["Perl", "pl"]),
    language("pgsql", ["PostgreSQL", "postgres", "pg", "postgre"]),
    language("php", ["PHP", "php"]),
    language("pla"),
    language("postiats", ["ATS", "ATS/Postiats"]),
    language("powerquery", ["PQ", "M", "Power Query", "Power Query M"]),
    language("powershell", ["PowerShell", "powershell", "ps", "ps1"]),
    language("proto", ["protobuf", "Protocol Buffers"]),
    language("pug", ["Pug", "Jade", "jade"]),
    language("python", ["Python", "py"]),
    language("qsharp", ["Q#", "qsharp"]),
    language("r", ["R", "r"]),
    language("razor", ["Razor", "razor"]),
    language("redis", ["redis"]),
    language("redshift", ["Redshift", "redshift"]),
    language("restructuredtext", ["reStructuredText", "restructuredtext"]),
    language("ruby", ["Ruby", "rb"]),
    language("rust", ["Rust", "rust"]),
    language("sb", ["Small Basic", "sb"]),
    language("scala", ["Scala", "scala", "SBT", "Sbt", "sbt", "Dotty", "dotty"]),
    language("scheme", ["Scheme", "scheme"]),
    language("scss", ["Sass", "sass", "scss"]),
    language("shell", ["Shell", "sh"]),
    language("sol", ["sol", "solidity", "Solidity"]),
    language("sparql", ["SPARQL", "sparql"]),
    language("sql", ["SQL"]),
    language("st", ["StructuredText", "scl", "stl"]),
    language("swift", ["Swift", "swift"]),
    language("systemverilog", ["SV", "sv", "SystemVerilog", "systemverilog"]),
    language("tcl", ["Tcl", "tcl", "TclTk", "tcltk", "Tcl/Tk", "tcl/tk"]),
    language("twig", ["Twig", "twig"]),
    language("typescript", ["TypeScript", "ts", "typescript"]),
    language("typespec", ["TypeSpec"]),
    language("vb", ["Visual Basic", "vb"]),
    language("wgsl", ["WebGPU Shading Language", "WGSL", "wgsl"]),
    language("xml", ["XML", "xml"]),
    language("yaml", ["YAML", "yaml", "YML", "yml"]),
];

// 获取编辑器编辑语言对象
const getSourceLanguage = (land: string) => {
    for (let language of supportedLanguages) {
        if ([language.id, ...(language.aliases || [])].map(name => name.toLowerCase()).includes(land.toLowerCase())) {
            return language;
        }
    }
    return null;
};

// 定义自定义语言
const defineConfig = (name: string, language?: LanguageExtensionPoint | null, alias?: string[]) => {
    return {
        name,
        alias: alias || [],
        language: language,
    };
};

// 自定义语言配置
const customLanguages = [
    defineConfig("GraphQL"),
    defineConfig("Vue", getSourceLanguage("html")),
    defineConfig("Angular", getSourceLanguage("html")),
    defineConfig("HTML Table", getSourceLanguage("html"), ["html_table"]),
    defineConfig("PHP Array", getSourceLanguage("php"), ["php_array"]),
    defineConfig("Php Serialize", getSourceLanguage("php"), ["php_serialize"]),
    defineConfig("Http Query String", null, ["http_query_string"]),
    defineConfig("JSON Schema", getSourceLanguage("json")),
    defineConfig("JavaScript PropTypes", getSourceLanguage("TypeScript")),
    defineConfig("Flow", getSourceLanguage("TypeScript")),
    defineConfig("Text"),
    defineConfig("CSV"),
    defineConfig("C-99", getSourceLanguage("c"), ["c99"]),
    defineConfig("C++ 14", getSourceLanguage("c++"), ["cpp14"]),
    defineConfig("C++ 17", getSourceLanguage("c++"), ["cpp17"]),
    defineConfig("Python 2", getSourceLanguage("python"), ["python2"]),
    defineConfig("Python 3", getSourceLanguage("python"), ["python3"]),
    defineConfig("VB.NET", getSourceLanguage("VB.NET"), ["vbn"]),
    defineConfig("JavaScript", getSourceLanguage("JavaScript"), ["nodejs"]),
];

// 获取 编辑器 语言处理对象
export const getEditorLanguage = (land: string): LanguageExtensionPoint => {
    const language = getSourceLanguage(land);
    if (language) {
        return language;
    }

    // 自定义
    for (let item of customLanguages) {
        if ([item.name, ...item.alias].map(name => name.toLowerCase()).includes(land.toLowerCase()) && item.language) {
            return item.language;
        }
    }
    return getSourceLanguage("plaintext") as LanguageExtensionPoint;
};

// 获取程序语言显示名称
export const getDisplayName = (land: string) => {
    // 自定义
    for (let language of customLanguages) {
        if ([language.name, ...language.alias].map(name => name.toLowerCase()).includes(land.toLowerCase())) {
            return language.name;
        }
    }

    const language = getSourceLanguage(land);
    if (language !== null) {
        return language.aliases ? language.aliases[0] : language.id;
    }

    return land;
};

export const allLanguage = (() => {
    return [
        ...supportedLanguages.map(item => (item.aliases ? item.aliases[0] : item.id)),
        ...customLanguages.map(item => item.name),
    ].sort();
})();
