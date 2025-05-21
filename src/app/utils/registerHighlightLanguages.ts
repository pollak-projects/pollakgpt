"use client";

import hljs from "highlight.js/lib/core";

// Register common languages
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import csharp from "highlight.js/lib/languages/csharp";
import cpp from "highlight.js/lib/languages/cpp";
import php from "highlight.js/lib/languages/php";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import sql from "highlight.js/lib/languages/sql";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import markdown from "highlight.js/lib/languages/markdown";
import yaml from "highlight.js/lib/languages/yaml";
import ini from "highlight.js/lib/languages/ini";
import diff from "highlight.js/lib/languages/diff";
import ruby from "highlight.js/lib/languages/ruby";
import go from "highlight.js/lib/languages/go";

export function registerHighlightLanguages() {
  // Register individual languages
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("js", javascript);
  hljs.registerLanguage("typescript", typescript);
  hljs.registerLanguage("ts", typescript);
  hljs.registerLanguage("jsx", javascript); // JSX uses JavaScript highlighter
  hljs.registerLanguage("tsx", typescript); // TSX uses TypeScript highlighter
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("py", python);
  hljs.registerLanguage("java", java);
  hljs.registerLanguage("csharp", csharp);
  hljs.registerLanguage("cs", csharp);
  hljs.registerLanguage("cpp", cpp);
  hljs.registerLanguage("c++", cpp);
  hljs.registerLanguage("php", php);
  hljs.registerLanguage("html", xml);
  hljs.registerLanguage("xml", xml);
  hljs.registerLanguage("css", css);
  hljs.registerLanguage("sql", sql);
  hljs.registerLanguage("json", json);
  hljs.registerLanguage("bash", bash);
  hljs.registerLanguage("sh", bash);
  hljs.registerLanguage("shell", bash);
  hljs.registerLanguage("markdown", markdown);
  hljs.registerLanguage("md", markdown);
  hljs.registerLanguage("yaml", yaml);
  hljs.registerLanguage("yml", yaml);
  hljs.registerLanguage("ini", ini);
  hljs.registerLanguage("diff", diff);
  hljs.registerLanguage("ruby", ruby);
  hljs.registerLanguage("rb", ruby);
  hljs.registerLanguage("go", go);

  // Add polyfill for highlightBlock for backward compatibility
  if (!hljs.highlightBlock) {
    hljs.highlightBlock = (element: HTMLElement) => {
      hljs.highlightElement(element);
    };
  }

  return hljs;
}

export default registerHighlightLanguages;
