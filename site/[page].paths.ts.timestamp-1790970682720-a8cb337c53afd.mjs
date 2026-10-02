// .vitepress/docs/content.ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// content/tinyval/meta.ts
var meta_default = {
  name: "tinyval",
  description: {
    ru: "\u0412\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u044F \u0434\u043B\u044F \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430 \u0438 \u0441\u0435\u0440\u0432\u0435\u0440\u0430. \u0411\u0435\u0437 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0435\u0439, ~3 kB, \u0442\u0438\u043F\u044B \u0438\u0437 \u0441\u0445\u0435\u043C\u044B.",
    en: "Validation for browser and server. Zero dependencies, ~3 kB, types inferred from schemas.",
    zh: "\u9002\u7528\u4E8E\u6D4F\u89C8\u5668\u548C\u670D\u52A1\u7AEF\u7684\u6570\u636E\u6821\u9A8C\u3002\u96F6\u4F9D\u8D56\uFF0C\u7EA6 3 kB\uFF0C\u7C7B\u578B\u4ECE Schema \u63A8\u5BFC\u3002"
  },
  intro: { ru: "\u0412\u0432\u0435\u0434\u0435\u043D\u0438\u0435", en: "Introduction", zh: "\u4ECB\u7ECD" },
  sections: [
    {
      dir: "guide",
      title: { ru: "\u0420\u0443\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u043E", en: "Guide", zh: "\u6307\u5357" },
      pages: [
        { slug: "empty-values", title: { ru: "\u041F\u0443\u0441\u0442\u044B\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F", en: "Empty values", zh: "\u7A7A\u503C" } },
        { slug: "messages", title: { ru: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0438 \u043B\u043E\u043A\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F", en: "Messages & i18n", zh: "\u9519\u8BEF\u4FE1\u606F\u4E0E\u56FD\u9645\u5316" } },
        { slug: "typescript", title: "TypeScript" },
        { slug: "custom-rules", title: { ru: "\u0421\u0432\u043E\u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u0438 \u0441\u0445\u0435\u043C\u044B", en: "Custom rules & schemas", zh: "\u81EA\u5B9A\u4E49\u89C4\u5219\u4E0E Schema" } },
        { slug: "custom-lang", title: { ru: "\u0421\u0432\u043E\u0439 lang-\u0444\u0430\u0439\u043B", en: "Custom lang file", zh: "\u81EA\u5B9A\u4E49\u8BED\u8A00\u6587\u4EF6" } },
        { slug: "standard-schema", title: "Standard Schema" }
      ]
    },
    {
      dir: "integrations",
      title: { ru: "\u0418\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438", en: "Integrations", zh: "\u96C6\u6210" },
      pages: [{ slug: "vue", title: "Vue" }]
    },
    {
      dir: "api",
      title: { ru: "\u0424\u0443\u043D\u043A\u0446\u0438\u0438", en: "Functions", zh: "\u51FD\u6570" },
      pages: ["validate", "validateAsync", "parse", "parseAsync", "ValidationError", "flatten", "setMessages", "setLabels", "createSchema"]
    },
    {
      dir: "schemas",
      title: { ru: "\u0421\u0445\u0435\u043C\u044B", en: "Schemas", zh: "Schema" },
      pages: ["string", "number", "boolean", "date", "literal", "oneOf", "enumOf", "unknown", "object", "array", "tuple", "record", "union", "variant", "lazy", "optional", "nullable", "fallback", "label", "transform", "preprocess", "coerce"]
    },
    {
      dir: "objects",
      title: { ru: "\u041E\u043F\u0435\u0440\u0430\u0446\u0438\u0438 \u0441 \u043E\u0431\u044A\u0435\u043A\u0442\u0430\u043C\u0438", en: "Object helpers", zh: "\u5BF9\u8C61\u64CD\u4F5C" },
      pages: ["partial", "pick", "omit", "extend"]
    },
    {
      dir: "actions",
      title: { ru: "\u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u0438 \u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u044F", en: "Rules & transforms", zh: "\u89C4\u5219\u4E0E\u8F6C\u6362" },
      pages: ["pipe", "minLength", "maxLength", "length", "min", "max", "integer", "pattern", "email", "sameAs", "trim", "toLowerCase", "toUpperCase", "check", "checkAsync"]
    }
  ]
};

// content/tinyval-vue/meta.ts
var meta_default2 = {
  name: "tinyval-vue",
  description: {
    ru: "\u0424\u043E\u0440\u043C\u044B \u0432\u043E Vue 3 \u043D\u0430 \u0441\u0445\u0435\u043C\u0430\u0445 tinyval: v-model, \u043E\u0448\u0438\u0431\u043A\u0438, \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0430, \u043E\u0448\u0438\u0431\u043A\u0438 \u0441\u0435\u0440\u0432\u0435\u0440\u0430. ~1 kB.",
    en: "Vue 3 forms on tinyval schemas: v-model, errors, submit, server errors. ~1 kB.",
    zh: "\u57FA\u4E8E tinyval Schema \u7684 Vue 3 \u8868\u5355\uFF1Av-model\u3001\u9519\u8BEF\u3001\u63D0\u4EA4\u3001\u670D\u52A1\u7AEF\u9519\u8BEF\u3002\u7EA6 1 kB\u3002"
  },
  intro: { ru: "\u0412\u0432\u0435\u0434\u0435\u043D\u0438\u0435", en: "Introduction", zh: "\u4ECB\u7ECD" },
  sections: [
    {
      dir: "guide",
      title: { ru: "\u0420\u0443\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u043E", en: "Guide", zh: "\u6307\u5357" },
      pages: [
        { slug: "fields", title: { ru: "\u041F\u043E\u043B\u044F \u0444\u043E\u0440\u043C\u044B", en: "Form fields", zh: "\u8868\u5355\u5B57\u6BB5" } },
        { slug: "errors", title: { ru: "\u041E\u0448\u0438\u0431\u043A\u0438", en: "Errors", zh: "\u9519\u8BEF" } },
        { slug: "async", title: { ru: "\u0410\u0441\u0438\u043D\u0445\u0440\u043E\u043D\u043D\u044B\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438", en: "Async checks", zh: "\u5F02\u6B65\u68C0\u67E5" } },
        { slug: "ui-libraries", title: { ru: "UI-\u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438", en: "UI libraries", zh: "UI \u7EC4\u4EF6\u5E93" } }
      ]
    },
    {
      dir: "api",
      title: { ru: "API", en: "API", zh: "API" },
      pages: ["useForm"]
    }
  ]
};

// content/index.ts
var packages = [meta_default, meta_default2];

// .vitepress/i18n/ru.ts
var ru_default = {
  code: "ru",
  label: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
  lang: "ru-RU",
  description: "\u041C\u0430\u043B\u0435\u043D\u044C\u043A\u0438\u0435 npm-\u043F\u0430\u043A\u0435\u0442\u044B \u0431\u0435\u0437 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0435\u0439",
  nav: { packages: "\u041F\u0430\u043A\u0435\u0442\u044B" },
  home: { tagline: "\u041C\u0430\u043B\u0435\u043D\u044C\u043A\u0438\u0435, \u0431\u044B\u0441\u0442\u0440\u044B\u0435 npm-\u043F\u0430\u043A\u0435\u0442\u044B \u0431\u0435\u0437 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0435\u0439", action: "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043F\u0430\u043A\u0435\u0442\u044B" },
  theme: {
    outline: "\u041D\u0430 \u044D\u0442\u043E\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435",
    prev: "\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0430\u044F",
    next: "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F",
    returnToTop: "\u041D\u0430\u0432\u0435\u0440\u0445",
    menu: "\u041C\u0435\u043D\u044E",
    darkModeSwitch: "\u0422\u0435\u043C\u0430",
    lightModeTitle: "\u0421\u0432\u0435\u0442\u043B\u0430\u044F \u0442\u0435\u043C\u0430",
    darkModeTitle: "\u0422\u0451\u043C\u043D\u0430\u044F \u0442\u0435\u043C\u0430",
    langMenu: "\u042F\u0437\u044B\u043A",
    notFound: { title: "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430", quote: "\u0422\u0430\u043A\u043E\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u043D\u0435\u0442.", linkText: "\u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E" }
  },
  search: {
    button: "\u041F\u043E\u0438\u0441\u043A",
    noResults: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E",
    reset: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C",
    select: "\u0432\u044B\u0431\u0440\u0430\u0442\u044C",
    navigate: "\u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F",
    close: "\u0437\u0430\u043A\u0440\u044B\u0442\u044C"
  },
  docs: { signature: "\u0421\u0438\u0433\u043D\u0430\u0442\u0443\u0440\u0430", params: "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B", codes: "\u041A\u043E\u0434\u044B \u043E\u0448\u0438\u0431\u043E\u043A", examples: "\u041F\u0440\u0438\u043C\u0435\u0440\u044B", example: "\u041F\u0440\u0438\u043C\u0435\u0440", see: "\u0421\u043C. \u0442\u0430\u043A\u0436\u0435", notes: "\u041E\u0441\u043E\u0431\u0435\u043D\u043D\u043E\u0441\u0442\u0438" },
  demo: {
    version: "\u0412\u0435\u0440\u0441\u0438\u044F",
    local: "\u043B\u043E\u043A\u0430\u043B\u044C\u043D\u0430\u044F",
    unpublished: "\u043F\u0430\u043A\u0435\u0442 \u0435\u0449\u0451 \u043D\u0435 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D \u043D\u0430 npm",
    loading: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026",
    failed: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C"
  }
};

// .vitepress/i18n/en.ts
var en_default = {
  code: "en",
  label: "English",
  lang: "en-US",
  description: "Tiny zero-dependency npm packages",
  nav: { packages: "Packages" },
  home: { tagline: "Tiny, fast, zero-dependency npm packages", action: "Browse packages" },
  theme: {
    outline: "On this page",
    prev: "Previous page",
    next: "Next page",
    returnToTop: "Return to top",
    menu: "Menu",
    darkModeSwitch: "Appearance",
    lightModeTitle: "Switch to light theme",
    darkModeTitle: "Switch to dark theme",
    langMenu: "Change language",
    notFound: { title: "Page not found", quote: "This page does not exist.", linkText: "Take me home" }
  },
  search: {
    button: "Search",
    noResults: "No results for",
    reset: "Reset search",
    select: "to select",
    navigate: "to navigate",
    close: "to close"
  },
  docs: { signature: "Signature", params: "Parameters", codes: "Error codes", examples: "Examples", example: "Example", see: "See also", notes: "Notes" },
  demo: {
    version: "Version",
    local: "local",
    unpublished: "not published to npm yet",
    loading: "Loading\u2026",
    failed: "Failed to load"
  }
};

// .vitepress/i18n/zh.ts
var zh_default = {
  code: "zh",
  label: "\u7B80\u4F53\u4E2D\u6587",
  lang: "zh-CN",
  description: "\u5C0F\u5DE7\u3001\u96F6\u4F9D\u8D56\u7684 npm \u8F6F\u4EF6\u5305",
  nav: { packages: "\u8F6F\u4EF6\u5305" },
  home: { tagline: "\u5C0F\u5DE7\u3001\u5FEB\u901F\u3001\u96F6\u4F9D\u8D56\u7684 npm \u8F6F\u4EF6\u5305", action: "\u6D4F\u89C8\u8F6F\u4EF6\u5305" },
  theme: {
    outline: "\u672C\u9875\u76EE\u5F55",
    prev: "\u4E0A\u4E00\u9875",
    next: "\u4E0B\u4E00\u9875",
    returnToTop: "\u8FD4\u56DE\u9876\u90E8",
    menu: "\u83DC\u5355",
    darkModeSwitch: "\u4E3B\u9898",
    lightModeTitle: "\u5207\u6362\u5230\u6D45\u8272\u6A21\u5F0F",
    darkModeTitle: "\u5207\u6362\u5230\u6DF1\u8272\u6A21\u5F0F",
    langMenu: "\u8BED\u8A00",
    notFound: { title: "\u9875\u9762\u672A\u627E\u5230", quote: "\u8BE5\u9875\u9762\u4E0D\u5B58\u5728\u3002", linkText: "\u8FD4\u56DE\u9996\u9875" }
  },
  search: {
    button: "\u641C\u7D22",
    noResults: "\u6CA1\u6709\u627E\u5230\u7ED3\u679C",
    reset: "\u6E05\u9664",
    select: "\u9009\u62E9",
    navigate: "\u5207\u6362",
    close: "\u5173\u95ED"
  },
  docs: { signature: "\u7B7E\u540D", params: "\u53C2\u6570", codes: "\u9519\u8BEF\u4EE3\u7801", examples: "\u793A\u4F8B", example: "\u793A\u4F8B", see: "\u53E6\u8BF7\u53C2\u9605", notes: "\u6CE8\u610F\u4E8B\u9879" },
  demo: {
    version: "\u7248\u672C",
    local: "\u672C\u5730",
    unpublished: "\u5C1A\u672A\u53D1\u5E03\u5230 npm",
    loading: "\u52A0\u8F7D\u4E2D\u2026",
    failed: "\u52A0\u8F7D\u5931\u8D25"
  }
};

// .vitepress/i18n/index.ts
var langs = [ru_default, en_default, zh_default];
var defaultLang = "ru";
var fallbackLang = "en";
var prefix = (code) => code === defaultLang ? "" : `/${code}`;

// .vitepress/docs/content.ts
var __vite_injected_original_import_meta_url = "file:///home/kilkenny/www/npm-packages/site/.vitepress/docs/content.ts";
var contentDir = fileURLToPath(new URL("../../content", __vite_injected_original_import_meta_url));
function tr(text, code) {
  return typeof text === "string" ? text : text[code] ?? text[fallbackLang];
}
var slugOf = (p) => typeof p === "string" ? p.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : p.slug;
var titleOf = (p, code) => typeof p === "string" ? p : tr(p.title, code);
function localize(md, code) {
  const codes = new Set(langs.map((l) => l.code));
  const out = [];
  let group = null;
  let current = null;
  let depth = 0;
  let fence = false;
  const flush = () => {
    if (!group) return;
    const pick = group[code] ?? group[fallbackLang] ?? Object.values(group)[0];
    out.push(...pick, "");
    group = null;
  };
  for (const line of md.split("\n")) {
    if (current) {
      if (line.startsWith("```")) fence = !fence;
      if (!fence && /^:::+\s*\S/.test(line)) depth++;
      else if (!fence && /^:::+\s*$/.test(line)) {
        if (depth === 0) {
          current = null;
          continue;
        }
        depth--;
      }
      current.push(line);
      continue;
    }
    if (line.startsWith("```")) fence = !fence;
    const open = !fence && line.match(/^::: ([a-z]{2}(?:-[a-z]+)?)\s*$/);
    if (open && codes.has(open[1])) {
      group ??= {};
      current = group[open[1]] = [];
      continue;
    }
    if (group && line.trim() === "") continue;
    flush();
    out.push(line);
  }
  flush();
  return out.join("\n");
}
function render(md, t, pkg) {
  return localize(md, t.code).replace(/@t\((\w+)\)/g, (s, key) => t.docs[key] ?? s).replace(/\]\(~\//g, `](${prefix(t.code)}/${pkg.name}/`).replace(/\]\(@\//g, `](${prefix(t.code)}/`).replace(/\n{3,}/g, "\n\n");
}
var read = (file) => fs.readFileSync(path.join(contentDir, file), "utf-8");
var page = (title, body) => `---
title: ${JSON.stringify(title)}
---

# ${title}

${body}`;
function home(t) {
  const base = prefix(t.code);
  const features = packages.map((p) => `  - title: ${p.name}
    details: ${JSON.stringify(tr(p.description, t.code))}
    link: ${base}/${p.name}/`).join("\n");
  return `---
layout: home
hero:
  name: kilkenny packages
  tagline: ${JSON.stringify(t.home.tagline)}
  actions:
    - theme: brand
      text: ${JSON.stringify(t.home.action)}
      link: ${base}/${packages[0].name}/
features:
${features}
---
`;
}
function allPages() {
  const pages = [];
  for (const t of langs) {
    const base = prefix(t.code).slice(1);
    const at = (p) => base ? `${base}/${p}` : p;
    pages.push({ params: { page: at("index") }, content: home(t) });
    for (const pkg of packages) {
      pages.push({
        params: { page: at(`${pkg.name}/index`) },
        content: page(pkg.name, render(read(`${pkg.name}/index.md`), t, pkg))
      });
      for (const section of pkg.sections) {
        for (const p of section.pages) {
          const slug = slugOf(p);
          pages.push({
            params: { page: at(`${pkg.name}/${section.dir}/${slug}`) },
            content: page(titleOf(p, t.code), render(read(`${pkg.name}/${section.dir}/${slug}.md`), t, pkg))
          });
        }
      }
    }
  }
  return pages;
}

// [page].paths.ts
var page_paths_default = {
  paths: allPages
};
export {
  page_paths_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy9kb2NzL2NvbnRlbnQudHMiLCAiY29udGVudC90aW55dmFsL21ldGEudHMiLCAiY29udGVudC90aW55dmFsLXZ1ZS9tZXRhLnRzIiwgImNvbnRlbnQvaW5kZXgudHMiLCAiLnZpdGVwcmVzcy9pMThuL3J1LnRzIiwgIi52aXRlcHJlc3MvaTE4bi9lbi50cyIsICIudml0ZXByZXNzL2kxOG4vemgudHMiLCAiLnZpdGVwcmVzcy9pMThuL2luZGV4LnRzIiwgIltwYWdlXS5wYXRocy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2tpbGtlbm55L3d3dy9ucG0tcGFja2FnZXMvc2l0ZS8udml0ZXByZXNzL2RvY3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2tpbGtlbm55L3d3dy9ucG0tcGFja2FnZXMvc2l0ZS8udml0ZXByZXNzL2RvY3MvY29udGVudC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9raWxrZW5ueS93d3cvbnBtLXBhY2thZ2VzL3NpdGUvLnZpdGVwcmVzcy9kb2NzL2NvbnRlbnQudHNcIjsvLyBcdTA0MjFcdTA0MzFcdTA0M0VcdTA0NDBcdTA0M0FcdTA0MzAgXHUwNDQxXHUwNDQyXHUwNDQwXHUwNDMwXHUwNDNEXHUwNDM4XHUwNDQ2IFx1MDQ0MVx1MDQzMFx1MDQzOVx1MDQ0Mlx1MDQzMCBcdTA0MzhcdTA0MzcgY29udGVudC86IFx1MDQzRVx1MDQzNFx1MDQzOFx1MDQzRCBcdTA0MzhcdTA0NDFcdTA0NDVcdTA0M0VcdTA0MzRcdTA0M0RcdTA0MzhcdTA0M0EgXHUwNDNEXHUwNDMwIFx1MDQ0MVx1MDQ0Mlx1MDQ0MFx1MDQzMFx1MDQzRFx1MDQzOFx1MDQ0Nlx1MDQ0MywgXHUwNDRGXHUwNDM3XHUwNDRCXHUwNDNBXHUwNDNFXHUwNDMyXHUwNDRCXHUwNDM1IFx1MDQzMVx1MDQzQlx1MDQzRVx1MDQzQVx1MDQzOCA6OjogcnUgLyA6OjogZW4gLyAuLi5cbmltcG9ydCBmcyBmcm9tICdub2RlOmZzJztcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnO1xuaW1wb3J0IHR5cGUgeyBEZWZhdWx0VGhlbWUgfSBmcm9tICd2aXRlcHJlc3MnO1xuaW1wb3J0IHsgcGFja2FnZXMgfSBmcm9tICcuLi8uLi9jb250ZW50JztcbmltcG9ydCB0eXBlIHsgUGFja2FnZU1ldGEsIFBhZ2VSZWYsIFRyIH0gZnJvbSAnLi4vLi4vY29udGVudC90eXBlcyc7XG5pbXBvcnQgeyBmYWxsYmFja0xhbmcsIGxhbmdzLCBwcmVmaXgsIHR5cGUgTGFuZ0ZpbGUgfSBmcm9tICcuLi9pMThuJztcblxuZXhwb3J0IGNvbnN0IGNvbnRlbnREaXIgPSBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4uLy4uL2NvbnRlbnQnLCBpbXBvcnQubWV0YS51cmwpKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRyKHRleHQ6IFRyLCBjb2RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdHlwZW9mIHRleHQgPT09ICdzdHJpbmcnID8gdGV4dCA6ICh0ZXh0W2NvZGVdID8/IHRleHRbZmFsbGJhY2tMYW5nXSk7XG59XG5cbmNvbnN0IHNsdWdPZiA9IChwOiBQYWdlUmVmKSA9PiAodHlwZW9mIHAgPT09ICdzdHJpbmcnID8gcC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpIDogcC5zbHVnKTtcbmNvbnN0IHRpdGxlT2YgPSAocDogUGFnZVJlZiwgY29kZTogc3RyaW5nKSA9PiAodHlwZW9mIHAgPT09ICdzdHJpbmcnID8gcCA6IHRyKHAudGl0bGUsIGNvZGUpKTtcblxuLy8gXHUwNDFFXHUwNDQxXHUwNDQyXHUwNDMwXHUwNDMyXHUwNDNCXHUwNDRGXHUwNDM1XHUwNDQyIFx1MDQzMiBtYXJrZG93biBcdTA0M0VcdTA0MzFcdTA0NDlcdTA0MzhcdTA0MzUgXHUwNDQ3XHUwNDMwXHUwNDQxXHUwNDQyXHUwNDM4IFx1MDQzOCBcdTA0MzFcdTA0M0JcdTA0M0VcdTA0M0EgXHUwNDNEXHUwNDQzXHUwNDM2XHUwNDNEXHUwNDNFXHUwNDMzXHUwNDNFIFx1MDQ0Rlx1MDQzN1x1MDQ0Qlx1MDQzQVx1MDQzMCAoXHUwNDM4XHUwNDNCXHUwNDM4IFx1MDQ0Rlx1MDQzN1x1MDQ0Qlx1MDQzQVx1MDQzMCBcdTA0M0ZcdTA0M0UgXHUwNDQzXHUwNDNDXHUwNDNFXHUwNDNCXHUwNDQ3XHUwNDMwXHUwNDNEXHUwNDM4XHUwNDRFLCBcdTA0MzVcdTA0NDFcdTA0M0JcdTA0MzggXHUwNDNGXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDMyXHUwNDNFXHUwNDM0XHUwNDMwIFx1MDQzRFx1MDQzNVx1MDQ0MilcbmV4cG9ydCBmdW5jdGlvbiBsb2NhbGl6ZShtZDogc3RyaW5nLCBjb2RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBjb2RlcyA9IG5ldyBTZXQobGFuZ3MubWFwKChsKSA9PiBsLmNvZGUpKTtcbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBsZXQgZ3JvdXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPiB8IG51bGwgPSBudWxsO1xuICBsZXQgY3VycmVudDogc3RyaW5nW10gfCBudWxsID0gbnVsbDtcbiAgbGV0IGRlcHRoID0gMDtcbiAgbGV0IGZlbmNlID0gZmFsc2U7XG5cbiAgY29uc3QgZmx1c2ggPSAoKSA9PiB7XG4gICAgaWYgKCFncm91cCkgcmV0dXJuO1xuICAgIGNvbnN0IHBpY2sgPSBncm91cFtjb2RlXSA/PyBncm91cFtmYWxsYmFja0xhbmddID8/IE9iamVjdC52YWx1ZXMoZ3JvdXApWzBdO1xuICAgIG91dC5wdXNoKC4uLnBpY2ssICcnKTtcbiAgICBncm91cCA9IG51bGw7XG4gIH07XG5cbiAgZm9yIChjb25zdCBsaW5lIG9mIG1kLnNwbGl0KCdcXG4nKSkge1xuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBpZiAobGluZS5zdGFydHNXaXRoKCdgYGAnKSkgZmVuY2UgPSAhZmVuY2U7XG4gICAgICBpZiAoIWZlbmNlICYmIC9eOjo6K1xccypcXFMvLnRlc3QobGluZSkpIGRlcHRoKys7XG4gICAgICBlbHNlIGlmICghZmVuY2UgJiYgL146OjorXFxzKiQvLnRlc3QobGluZSkpIHtcbiAgICAgICAgaWYgKGRlcHRoID09PSAwKSB7XG4gICAgICAgICAgY3VycmVudCA9IG51bGw7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgZGVwdGgtLTtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnQucHVzaChsaW5lKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAobGluZS5zdGFydHNXaXRoKCdgYGAnKSkgZmVuY2UgPSAhZmVuY2U7XG4gICAgY29uc3Qgb3BlbiA9ICFmZW5jZSAmJiBsaW5lLm1hdGNoKC9eOjo6IChbYS16XXsyfSg/Oi1bYS16XSspPylcXHMqJC8pO1xuICAgIGlmIChvcGVuICYmIGNvZGVzLmhhcyhvcGVuWzFdKSkge1xuICAgICAgZ3JvdXAgPz89IHt9O1xuICAgICAgY3VycmVudCA9IGdyb3VwW29wZW5bMV1dID0gW107XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gXHUwNDNGXHUwNDQzXHUwNDQxXHUwNDQyXHUwNDRCXHUwNDM1IFx1MDQ0MVx1MDQ0Mlx1MDQ0MFx1MDQzRVx1MDQzQVx1MDQzOCBcdTA0M0NcdTA0MzVcdTA0MzZcdTA0MzRcdTA0NDMgXHUwNDRGXHUwNDM3XHUwNDRCXHUwNDNBXHUwNDNFXHUwNDMyXHUwNDRCXHUwNDNDXHUwNDM4IFx1MDQzMVx1MDQzQlx1MDQzRVx1MDQzQVx1MDQzMFx1MDQzQ1x1MDQzOCBcdTA0M0RcdTA0MzUgXHUwNDQwXHUwNDMwXHUwNDM3XHUwNDQwXHUwNDRCXHUwNDMyXHUwNDMwXHUwNDRFXHUwNDQyIFx1MDQzM1x1MDQ0MFx1MDQ0M1x1MDQzRlx1MDQzRlx1MDQ0M1xuICAgIGlmIChncm91cCAmJiBsaW5lLnRyaW0oKSA9PT0gJycpIGNvbnRpbnVlO1xuICAgIGZsdXNoKCk7XG4gICAgb3V0LnB1c2gobGluZSk7XG4gIH1cbiAgZmx1c2goKTtcbiAgcmV0dXJuIG91dC5qb2luKCdcXG4nKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyKG1kOiBzdHJpbmcsIHQ6IExhbmdGaWxlLCBwa2c6IFBhY2thZ2VNZXRhKTogc3RyaW5nIHtcbiAgcmV0dXJuIGxvY2FsaXplKG1kLCB0LmNvZGUpXG4gICAgLnJlcGxhY2UoL0B0XFwoKFxcdyspXFwpL2csIChzLCBrZXkpID0+IHQuZG9jc1trZXkgYXMga2V5b2YgTGFuZ0ZpbGVbJ2RvY3MnXV0gPz8gcylcbiAgICAucmVwbGFjZSgvXFxdXFwoflxcLy9nLCBgXSgke3ByZWZpeCh0LmNvZGUpfS8ke3BrZy5uYW1lfS9gKVxuICAgIC8vIFx1MDQ0MVx1MDQ0MVx1MDQ0Qlx1MDQzQlx1MDQzQVx1MDQzMCBcdTA0M0RcdTA0MzAgXHUwNDM0XHUwNDQwXHUwNDQzXHUwNDMzXHUwNDNFXHUwNDM5IFx1MDQzRlx1MDQzMFx1MDQzQVx1MDQzNVx1MDQ0MiBcdTA0NDFcdTA0MzBcdTA0MzlcdTA0NDJcdTA0MzA6IFtvYmplY3RdKEAvdGlueXZhbC9zY2hlbWFzL29iamVjdClcbiAgICAucmVwbGFjZSgvXFxdXFwoQFxcLy9nLCBgXSgke3ByZWZpeCh0LmNvZGUpfS9gKVxuICAgIC5yZXBsYWNlKC9cXG57Myx9L2csICdcXG5cXG4nKTtcbn1cblxuY29uc3QgcmVhZCA9IChmaWxlOiBzdHJpbmcpID0+IGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oY29udGVudERpciwgZmlsZSksICd1dGYtOCcpO1xuXG5jb25zdCBwYWdlID0gKHRpdGxlOiBzdHJpbmcsIGJvZHk6IHN0cmluZykgPT4gYC0tLVxcbnRpdGxlOiAke0pTT04uc3RyaW5naWZ5KHRpdGxlKX1cXG4tLS1cXG5cXG4jICR7dGl0bGV9XFxuXFxuJHtib2R5fWA7XG5cbmZ1bmN0aW9uIGhvbWUodDogTGFuZ0ZpbGUpOiBzdHJpbmcge1xuICBjb25zdCBiYXNlID0gcHJlZml4KHQuY29kZSk7XG4gIGNvbnN0IGZlYXR1cmVzID0gcGFja2FnZXNcbiAgICAubWFwKChwKSA9PiBgICAtIHRpdGxlOiAke3AubmFtZX1cXG4gICAgZGV0YWlsczogJHtKU09OLnN0cmluZ2lmeSh0cihwLmRlc2NyaXB0aW9uLCB0LmNvZGUpKX1cXG4gICAgbGluazogJHtiYXNlfS8ke3AubmFtZX0vYClcbiAgICAuam9pbignXFxuJyk7XG4gIHJldHVybiBgLS0tXG5sYXlvdXQ6IGhvbWVcbmhlcm86XG4gIG5hbWU6IGtpbGtlbm55IHBhY2thZ2VzXG4gIHRhZ2xpbmU6ICR7SlNPTi5zdHJpbmdpZnkodC5ob21lLnRhZ2xpbmUpfVxuICBhY3Rpb25zOlxuICAgIC0gdGhlbWU6IGJyYW5kXG4gICAgICB0ZXh0OiAke0pTT04uc3RyaW5naWZ5KHQuaG9tZS5hY3Rpb24pfVxuICAgICAgbGluazogJHtiYXNlfS8ke3BhY2thZ2VzWzBdLm5hbWV9L1xuZmVhdHVyZXM6XG4ke2ZlYXR1cmVzfVxuLS0tXG5gO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBhZ2VFbnRyeSB7XG4gIHBhcmFtczogeyBwYWdlOiBzdHJpbmcgfTtcbiAgY29udGVudDogc3RyaW5nO1xufVxuXG4vLyBcdTA0MTJcdTA0NDFcdTA0MzUgXHUwNDQxXHUwNDQyXHUwNDQwXHUwNDMwXHUwNDNEXHUwNDM4XHUwNDQ2XHUwNDRCIFx1MDQ0MVx1MDQzMFx1MDQzOVx1MDQ0Mlx1MDQzMCBcdTA0M0RcdTA0MzAgXHUwNDMyXHUwNDQxXHUwNDM1XHUwNDQ1IFx1MDQ0Rlx1MDQzN1x1MDQ0Qlx1MDQzQVx1MDQzMFx1MDQ0NVxuZXhwb3J0IGZ1bmN0aW9uIGFsbFBhZ2VzKCk6IFBhZ2VFbnRyeVtdIHtcbiAgY29uc3QgcGFnZXM6IFBhZ2VFbnRyeVtdID0gW107XG4gIGZvciAoY29uc3QgdCBvZiBsYW5ncykge1xuICAgIGNvbnN0IGJhc2UgPSBwcmVmaXgodC5jb2RlKS5zbGljZSgxKTtcbiAgICBjb25zdCBhdCA9IChwOiBzdHJpbmcpID0+IChiYXNlID8gYCR7YmFzZX0vJHtwfWAgOiBwKTtcbiAgICBwYWdlcy5wdXNoKHsgcGFyYW1zOiB7IHBhZ2U6IGF0KCdpbmRleCcpIH0sIGNvbnRlbnQ6IGhvbWUodCkgfSk7XG4gICAgZm9yIChjb25zdCBwa2cgb2YgcGFja2FnZXMpIHtcbiAgICAgIHBhZ2VzLnB1c2goe1xuICAgICAgICBwYXJhbXM6IHsgcGFnZTogYXQoYCR7cGtnLm5hbWV9L2luZGV4YCkgfSxcbiAgICAgICAgY29udGVudDogcGFnZShwa2cubmFtZSwgcmVuZGVyKHJlYWQoYCR7cGtnLm5hbWV9L2luZGV4Lm1kYCksIHQsIHBrZykpLFxuICAgICAgfSk7XG4gICAgICBmb3IgKGNvbnN0IHNlY3Rpb24gb2YgcGtnLnNlY3Rpb25zKSB7XG4gICAgICAgIGZvciAoY29uc3QgcCBvZiBzZWN0aW9uLnBhZ2VzKSB7XG4gICAgICAgICAgY29uc3Qgc2x1ZyA9IHNsdWdPZihwKTtcbiAgICAgICAgICBwYWdlcy5wdXNoKHtcbiAgICAgICAgICAgIHBhcmFtczogeyBwYWdlOiBhdChgJHtwa2cubmFtZX0vJHtzZWN0aW9uLmRpcn0vJHtzbHVnfWApIH0sXG4gICAgICAgICAgICBjb250ZW50OiBwYWdlKHRpdGxlT2YocCwgdC5jb2RlKSwgcmVuZGVyKHJlYWQoYCR7cGtnLm5hbWV9LyR7c2VjdGlvbi5kaXJ9LyR7c2x1Z30ubWRgKSwgdCwgcGtnKSksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhZ2VzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2lkZWJhcihwa2c6IFBhY2thZ2VNZXRhLCBjb2RlOiBzdHJpbmcpOiBEZWZhdWx0VGhlbWUuU2lkZWJhckl0ZW1bXSB7XG4gIGNvbnN0IGJhc2UgPSBgJHtwcmVmaXgoY29kZSl9LyR7cGtnLm5hbWV9YDtcbiAgcmV0dXJuIFtcbiAgICB7IHRleHQ6IHRyKHBrZy5pbnRybywgY29kZSksIGxpbms6IGAke2Jhc2V9L2AgfSxcbiAgICAuLi5wa2cuc2VjdGlvbnMubWFwKChzKSA9PiAoe1xuICAgICAgdGV4dDogdHIocy50aXRsZSwgY29kZSksXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXRlbXM6IHMucGFnZXMubWFwKChwKSA9PiAoeyB0ZXh0OiB0aXRsZU9mKHAsIGNvZGUpLCBsaW5rOiBgJHtiYXNlfS8ke3MuZGlyfS8ke3NsdWdPZihwKX1gIH0pKSxcbiAgICB9KSksXG4gIF07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2tpbGtlbm55L3d3dy9ucG0tcGFja2FnZXMvc2l0ZS9jb250ZW50L3Rpbnl2YWxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2tpbGtlbm55L3d3dy9ucG0tcGFja2FnZXMvc2l0ZS9jb250ZW50L3Rpbnl2YWwvbWV0YS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9raWxrZW5ueS93d3cvbnBtLXBhY2thZ2VzL3NpdGUvY29udGVudC90aW55dmFsL21ldGEudHNcIjtpbXBvcnQgdHlwZSB7IFBhY2thZ2VNZXRhIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICd0aW55dmFsJyxcbiAgZGVzY3JpcHRpb246IHtcbiAgICBydTogJ1x1MDQxMlx1MDQzMFx1MDQzQlx1MDQzOFx1MDQzNFx1MDQzMFx1MDQ0Nlx1MDQzOFx1MDQ0RiBcdTA0MzRcdTA0M0JcdTA0NEYgXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDQzXHUwNDM3XHUwNDM1XHUwNDQwXHUwNDMwIFx1MDQzOCBcdTA0NDFcdTA0MzVcdTA0NDBcdTA0MzJcdTA0MzVcdTA0NDBcdTA0MzAuIFx1MDQxMVx1MDQzNVx1MDQzNyBcdTA0MzdcdTA0MzBcdTA0MzJcdTA0MzhcdTA0NDFcdTA0MzhcdTA0M0NcdTA0M0VcdTA0NDFcdTA0NDJcdTA0MzVcdTA0MzksIH4zIGtCLCBcdTA0NDJcdTA0MzhcdTA0M0ZcdTA0NEIgXHUwNDM4XHUwNDM3IFx1MDQ0MVx1MDQ0NVx1MDQzNVx1MDQzQ1x1MDQ0Qi4nLFxuICAgIGVuOiAnVmFsaWRhdGlvbiBmb3IgYnJvd3NlciBhbmQgc2VydmVyLiBaZXJvIGRlcGVuZGVuY2llcywgfjMga0IsIHR5cGVzIGluZmVycmVkIGZyb20gc2NoZW1hcy4nLFxuICAgIHpoOiAnXHU5MDAyXHU3NTI4XHU0RThFXHU2RDRGXHU4OUM4XHU1NjY4XHU1NDhDXHU2NzBEXHU1MkExXHU3QUVGXHU3Njg0XHU2NTcwXHU2MzZFXHU2ODIxXHU5QThDXHUzMDAyXHU5NkY2XHU0RjlEXHU4RDU2XHVGRjBDXHU3RUE2IDMga0JcdUZGMENcdTdDN0JcdTU3OEJcdTRFQ0UgU2NoZW1hIFx1NjNBOFx1NUJGQ1x1MzAwMicsXG4gIH0sXG4gIGludHJvOiB7IHJ1OiAnXHUwNDEyXHUwNDMyXHUwNDM1XHUwNDM0XHUwNDM1XHUwNDNEXHUwNDM4XHUwNDM1JywgZW46ICdJbnRyb2R1Y3Rpb24nLCB6aDogJ1x1NEVDQlx1N0VDRCcgfSxcbiAgc2VjdGlvbnM6IFtcbiAgICB7XG4gICAgICBkaXI6ICdndWlkZScsXG4gICAgICB0aXRsZTogeyBydTogJ1x1MDQyMFx1MDQ0M1x1MDQzQVx1MDQzRVx1MDQzMlx1MDQzRVx1MDQzNFx1MDQ0MVx1MDQ0Mlx1MDQzMlx1MDQzRScsIGVuOiAnR3VpZGUnLCB6aDogJ1x1NjMwN1x1NTM1NycgfSxcbiAgICAgIHBhZ2VzOiBbXG4gICAgICAgIHsgc2x1ZzogJ2VtcHR5LXZhbHVlcycsIHRpdGxlOiB7IHJ1OiAnXHUwNDFGXHUwNDQzXHUwNDQxXHUwNDQyXHUwNDRCXHUwNDM1IFx1MDQzN1x1MDQzRFx1MDQzMFx1MDQ0N1x1MDQzNVx1MDQzRFx1MDQzOFx1MDQ0RicsIGVuOiAnRW1wdHkgdmFsdWVzJywgemg6ICdcdTdBN0FcdTUwM0MnIH0gfSxcbiAgICAgICAgeyBzbHVnOiAnbWVzc2FnZXMnLCB0aXRsZTogeyBydTogJ1x1MDQyMVx1MDQzRVx1MDQzRVx1MDQzMVx1MDQ0OVx1MDQzNVx1MDQzRFx1MDQzOFx1MDQ0RiBcdTA0MzggXHUwNDNCXHUwNDNFXHUwNDNBXHUwNDMwXHUwNDNCXHUwNDM4XHUwNDM3XHUwNDMwXHUwNDQ2XHUwNDM4XHUwNDRGJywgZW46ICdNZXNzYWdlcyAmIGkxOG4nLCB6aDogJ1x1OTUxOVx1OEJFRlx1NEZFMVx1NjA2Rlx1NEUwRVx1NTZGRFx1OTY0NVx1NTMxNicgfSB9LFxuICAgICAgICB7IHNsdWc6ICd0eXBlc2NyaXB0JywgdGl0bGU6ICdUeXBlU2NyaXB0JyB9LFxuICAgICAgICB7IHNsdWc6ICdjdXN0b20tcnVsZXMnLCB0aXRsZTogeyBydTogJ1x1MDQyMVx1MDQzMlx1MDQzRVx1MDQzOCBcdTA0M0ZcdTA0NDBcdTA0MzBcdTA0MzJcdTA0MzhcdTA0M0JcdTA0MzAgXHUwNDM4IFx1MDQ0MVx1MDQ0NVx1MDQzNVx1MDQzQ1x1MDQ0QicsIGVuOiAnQ3VzdG9tIHJ1bGVzICYgc2NoZW1hcycsIHpoOiAnXHU4MUVBXHU1QjlBXHU0RTQ5XHU4OUM0XHU1MjE5XHU0RTBFIFNjaGVtYScgfSB9LFxuICAgICAgICB7IHNsdWc6ICdjdXN0b20tbGFuZycsIHRpdGxlOiB7IHJ1OiAnXHUwNDIxXHUwNDMyXHUwNDNFXHUwNDM5IGxhbmctXHUwNDQ0XHUwNDMwXHUwNDM5XHUwNDNCJywgZW46ICdDdXN0b20gbGFuZyBmaWxlJywgemg6ICdcdTgxRUFcdTVCOUFcdTRFNDlcdThCRURcdThBMDBcdTY1ODdcdTRFRjYnIH0gfSxcbiAgICAgICAgeyBzbHVnOiAnc3RhbmRhcmQtc2NoZW1hJywgdGl0bGU6ICdTdGFuZGFyZCBTY2hlbWEnIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgZGlyOiAnaW50ZWdyYXRpb25zJyxcbiAgICAgIHRpdGxlOiB7IHJ1OiAnXHUwNDE4XHUwNDNEXHUwNDQyXHUwNDM1XHUwNDMzXHUwNDQwXHUwNDMwXHUwNDQ2XHUwNDM4XHUwNDM4JywgZW46ICdJbnRlZ3JhdGlvbnMnLCB6aDogJ1x1OTZDNlx1NjIxMCcgfSxcbiAgICAgIHBhZ2VzOiBbeyBzbHVnOiAndnVlJywgdGl0bGU6ICdWdWUnIH1dLFxuICAgIH0sXG4gICAge1xuICAgICAgZGlyOiAnYXBpJyxcbiAgICAgIHRpdGxlOiB7IHJ1OiAnXHUwNDI0XHUwNDQzXHUwNDNEXHUwNDNBXHUwNDQ2XHUwNDM4XHUwNDM4JywgZW46ICdGdW5jdGlvbnMnLCB6aDogJ1x1NTFGRFx1NjU3MCcgfSxcbiAgICAgIHBhZ2VzOiBbJ3ZhbGlkYXRlJywgJ3ZhbGlkYXRlQXN5bmMnLCAncGFyc2UnLCAncGFyc2VBc3luYycsICdWYWxpZGF0aW9uRXJyb3InLCAnZmxhdHRlbicsICdzZXRNZXNzYWdlcycsICdzZXRMYWJlbHMnLCAnY3JlYXRlU2NoZW1hJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBkaXI6ICdzY2hlbWFzJyxcbiAgICAgIHRpdGxlOiB7IHJ1OiAnXHUwNDIxXHUwNDQ1XHUwNDM1XHUwNDNDXHUwNDRCJywgZW46ICdTY2hlbWFzJywgemg6ICdTY2hlbWEnIH0sXG4gICAgICBwYWdlczogWydzdHJpbmcnLCAnbnVtYmVyJywgJ2Jvb2xlYW4nLCAnZGF0ZScsICdsaXRlcmFsJywgJ29uZU9mJywgJ2VudW1PZicsICd1bmtub3duJywgJ29iamVjdCcsICdhcnJheScsICd0dXBsZScsICdyZWNvcmQnLCAndW5pb24nLCAndmFyaWFudCcsICdsYXp5JywgJ29wdGlvbmFsJywgJ251bGxhYmxlJywgJ2ZhbGxiYWNrJywgJ2xhYmVsJywgJ3RyYW5zZm9ybScsICdwcmVwcm9jZXNzJywgJ2NvZXJjZSddLFxuICAgIH0sXG4gICAge1xuICAgICAgZGlyOiAnb2JqZWN0cycsXG4gICAgICB0aXRsZTogeyBydTogJ1x1MDQxRVx1MDQzRlx1MDQzNVx1MDQ0MFx1MDQzMFx1MDQ0Nlx1MDQzOFx1MDQzOCBcdTA0NDEgXHUwNDNFXHUwNDMxXHUwNDRBXHUwNDM1XHUwNDNBXHUwNDQyXHUwNDMwXHUwNDNDXHUwNDM4JywgZW46ICdPYmplY3QgaGVscGVycycsIHpoOiAnXHU1QkY5XHU4QzYxXHU2NENEXHU0RjVDJyB9LFxuICAgICAgcGFnZXM6IFsncGFydGlhbCcsICdwaWNrJywgJ29taXQnLCAnZXh0ZW5kJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBkaXI6ICdhY3Rpb25zJyxcbiAgICAgIHRpdGxlOiB7IHJ1OiAnXHUwNDFGXHUwNDQwXHUwNDMwXHUwNDMyXHUwNDM4XHUwNDNCXHUwNDMwIFx1MDQzOCBcdTA0M0ZcdTA0NDBcdTA0MzVcdTA0M0VcdTA0MzFcdTA0NDBcdTA0MzBcdTA0MzdcdTA0M0VcdTA0MzJcdTA0MzBcdTA0M0RcdTA0MzhcdTA0NEYnLCBlbjogJ1J1bGVzICYgdHJhbnNmb3JtcycsIHpoOiAnXHU4OUM0XHU1MjE5XHU0RTBFXHU4RjZDXHU2MzYyJyB9LFxuICAgICAgcGFnZXM6IFsncGlwZScsICdtaW5MZW5ndGgnLCAnbWF4TGVuZ3RoJywgJ2xlbmd0aCcsICdtaW4nLCAnbWF4JywgJ2ludGVnZXInLCAncGF0dGVybicsICdlbWFpbCcsICdzYW1lQXMnLCAndHJpbScsICd0b0xvd2VyQ2FzZScsICd0b1VwcGVyQ2FzZScsICdjaGVjaycsICdjaGVja0FzeW5jJ10sXG4gICAgfSxcbiAgXSxcbn0gc2F0aXNmaWVzIFBhY2thZ2VNZXRhO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9raWxrZW5ueS93d3cvbnBtLXBhY2thZ2VzL3NpdGUvY29udGVudC90aW55dmFsLXZ1ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUva2lsa2Vubnkvd3d3L25wbS1wYWNrYWdlcy9zaXRlL2NvbnRlbnQvdGlueXZhbC12dWUvbWV0YS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9raWxrZW5ueS93d3cvbnBtLXBhY2thZ2VzL3NpdGUvY29udGVudC90aW55dmFsLXZ1ZS9tZXRhLnRzXCI7aW1wb3J0IHR5cGUgeyBQYWNrYWdlTWV0YSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAndGlueXZhbC12dWUnLFxuICBkZXNjcmlwdGlvbjoge1xuICAgIHJ1OiAnXHUwNDI0XHUwNDNFXHUwNDQwXHUwNDNDXHUwNDRCIFx1MDQzMlx1MDQzRSBWdWUgMyBcdTA0M0RcdTA0MzAgXHUwNDQxXHUwNDQ1XHUwNDM1XHUwNDNDXHUwNDMwXHUwNDQ1IHRpbnl2YWw6IHYtbW9kZWwsIFx1MDQzRVx1MDQ0OFx1MDQzOFx1MDQzMVx1MDQzQVx1MDQzOCwgXHUwNDNFXHUwNDQyXHUwNDNGXHUwNDQwXHUwNDMwXHUwNDMyXHUwNDNBXHUwNDMwLCBcdTA0M0VcdTA0NDhcdTA0MzhcdTA0MzFcdTA0M0FcdTA0MzggXHUwNDQxXHUwNDM1XHUwNDQwXHUwNDMyXHUwNDM1XHUwNDQwXHUwNDMwLiB+MSBrQi4nLFxuICAgIGVuOiAnVnVlIDMgZm9ybXMgb24gdGlueXZhbCBzY2hlbWFzOiB2LW1vZGVsLCBlcnJvcnMsIHN1Ym1pdCwgc2VydmVyIGVycm9ycy4gfjEga0IuJyxcbiAgICB6aDogJ1x1NTdGQVx1NEU4RSB0aW55dmFsIFNjaGVtYSBcdTc2ODQgVnVlIDMgXHU4ODY4XHU1MzU1XHVGRjFBdi1tb2RlbFx1MzAwMVx1OTUxOVx1OEJFRlx1MzAwMVx1NjNEMFx1NEVBNFx1MzAwMVx1NjcwRFx1NTJBMVx1N0FFRlx1OTUxOVx1OEJFRlx1MzAwMlx1N0VBNiAxIGtCXHUzMDAyJyxcbiAgfSxcbiAgaW50cm86IHsgcnU6ICdcdTA0MTJcdTA0MzJcdTA0MzVcdTA0MzRcdTA0MzVcdTA0M0RcdTA0MzhcdTA0MzUnLCBlbjogJ0ludHJvZHVjdGlvbicsIHpoOiAnXHU0RUNCXHU3RUNEJyB9LFxuICBzZWN0aW9uczogW1xuICAgIHtcbiAgICAgIGRpcjogJ2d1aWRlJyxcbiAgICAgIHRpdGxlOiB7IHJ1OiAnXHUwNDIwXHUwNDQzXHUwNDNBXHUwNDNFXHUwNDMyXHUwNDNFXHUwNDM0XHUwNDQxXHUwNDQyXHUwNDMyXHUwNDNFJywgZW46ICdHdWlkZScsIHpoOiAnXHU2MzA3XHU1MzU3JyB9LFxuICAgICAgcGFnZXM6IFtcbiAgICAgICAgeyBzbHVnOiAnZmllbGRzJywgdGl0bGU6IHsgcnU6ICdcdTA0MUZcdTA0M0VcdTA0M0JcdTA0NEYgXHUwNDQ0XHUwNDNFXHUwNDQwXHUwNDNDXHUwNDRCJywgZW46ICdGb3JtIGZpZWxkcycsIHpoOiAnXHU4ODY4XHU1MzU1XHU1QjU3XHU2QkI1JyB9IH0sXG4gICAgICAgIHsgc2x1ZzogJ2Vycm9ycycsIHRpdGxlOiB7IHJ1OiAnXHUwNDFFXHUwNDQ4XHUwNDM4XHUwNDMxXHUwNDNBXHUwNDM4JywgZW46ICdFcnJvcnMnLCB6aDogJ1x1OTUxOVx1OEJFRicgfSB9LFxuICAgICAgICB7IHNsdWc6ICdhc3luYycsIHRpdGxlOiB7IHJ1OiAnXHUwNDEwXHUwNDQxXHUwNDM4XHUwNDNEXHUwNDQ1XHUwNDQwXHUwNDNFXHUwNDNEXHUwNDNEXHUwNDRCXHUwNDM1IFx1MDQzRlx1MDQ0MFx1MDQzRVx1MDQzMlx1MDQzNVx1MDQ0MFx1MDQzQVx1MDQzOCcsIGVuOiAnQXN5bmMgY2hlY2tzJywgemg6ICdcdTVGMDJcdTZCNjVcdTY4QzBcdTY3RTUnIH0gfSxcbiAgICAgICAgeyBzbHVnOiAndWktbGlicmFyaWVzJywgdGl0bGU6IHsgcnU6ICdVSS1cdTA0MzFcdTA0MzhcdTA0MzFcdTA0M0JcdTA0MzhcdTA0M0VcdTA0NDJcdTA0MzVcdTA0M0FcdTA0MzgnLCBlbjogJ1VJIGxpYnJhcmllcycsIHpoOiAnVUkgXHU3RUM0XHU0RUY2XHU1RTkzJyB9IH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgZGlyOiAnYXBpJyxcbiAgICAgIHRpdGxlOiB7IHJ1OiAnQVBJJywgZW46ICdBUEknLCB6aDogJ0FQSScgfSxcbiAgICAgIHBhZ2VzOiBbJ3VzZUZvcm0nXSxcbiAgICB9LFxuICBdLFxufSBzYXRpc2ZpZXMgUGFja2FnZU1ldGE7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2tpbGtlbm55L3d3dy9ucG0tcGFja2FnZXMvc2l0ZS9jb250ZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9raWxrZW5ueS93d3cvbnBtLXBhY2thZ2VzL3NpdGUvY29udGVudC9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9raWxrZW5ueS93d3cvbnBtLXBhY2thZ2VzL3NpdGUvY29udGVudC9pbmRleC50c1wiOy8vIFx1MDQxRlx1MDQzMFx1MDQzQVx1MDQzNVx1MDQ0Mlx1MDQ0QiBcdTA0M0RcdTA0MzAgXHUwNDQxXHUwNDMwXHUwNDM5XHUwNDQyXHUwNDM1LiBcdTA0MURcdTA0M0VcdTA0MzJcdTA0NEJcdTA0MzkgXHUwNDNGXHUwNDMwXHUwNDNBXHUwNDM1XHUwNDQyOiBcdTA0M0ZcdTA0MzBcdTA0M0ZcdTA0M0FcdTA0MzAgY29udGVudC88XHUwNDM4XHUwNDNDXHUwNDRGPi8gXHUwNDQxIG1ldGEudHMgXHUwNDM4IFx1MDQ0MVx1MDQ0Mlx1MDQ0MFx1MDQzMFx1MDQzRFx1MDQzOFx1MDQ0Nlx1MDQzMFx1MDQzQ1x1MDQzOCwgXHUwNDM4IFx1MDQ0MVx1MDQ0Mlx1MDQ0MFx1MDQzRVx1MDQzQVx1MDQzMCBcdTA0MzdcdTA0MzRcdTA0MzVcdTA0NDFcdTA0NENcbmltcG9ydCB0aW55dmFsIGZyb20gJy4vdGlueXZhbC9tZXRhJztcbmltcG9ydCB0aW55dmFsVnVlIGZyb20gJy4vdGlueXZhbC12dWUvbWV0YSc7XG5pbXBvcnQgdHlwZSB7IFBhY2thZ2VNZXRhIH0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBwYWNrYWdlczogUGFja2FnZU1ldGFbXSA9IFt0aW55dmFsLCB0aW55dmFsVnVlXTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUva2lsa2Vubnkvd3d3L25wbS1wYWNrYWdlcy9zaXRlLy52aXRlcHJlc3MvaTE4blwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUva2lsa2Vubnkvd3d3L25wbS1wYWNrYWdlcy9zaXRlLy52aXRlcHJlc3MvaTE4bi9ydS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9raWxrZW5ueS93d3cvbnBtLXBhY2thZ2VzL3NpdGUvLnZpdGVwcmVzcy9pMThuL3J1LnRzXCI7aW1wb3J0IHR5cGUgeyBMYW5nRmlsZSB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvZGU6ICdydScsXG4gIGxhYmVsOiAnXHUwNDIwXHUwNDQzXHUwNDQxXHUwNDQxXHUwNDNBXHUwNDM4XHUwNDM5JyxcbiAgbGFuZzogJ3J1LVJVJyxcbiAgZGVzY3JpcHRpb246ICdcdTA0MUNcdTA0MzBcdTA0M0JcdTA0MzVcdTA0M0RcdTA0NENcdTA0M0FcdTA0MzhcdTA0MzUgbnBtLVx1MDQzRlx1MDQzMFx1MDQzQVx1MDQzNVx1MDQ0Mlx1MDQ0QiBcdTA0MzFcdTA0MzVcdTA0MzcgXHUwNDM3XHUwNDMwXHUwNDMyXHUwNDM4XHUwNDQxXHUwNDM4XHUwNDNDXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDM1XHUwNDM5JyxcbiAgbmF2OiB7IHBhY2thZ2VzOiAnXHUwNDFGXHUwNDMwXHUwNDNBXHUwNDM1XHUwNDQyXHUwNDRCJyB9LFxuICBob21lOiB7IHRhZ2xpbmU6ICdcdTA0MUNcdTA0MzBcdTA0M0JcdTA0MzVcdTA0M0RcdTA0NENcdTA0M0FcdTA0MzhcdTA0MzUsIFx1MDQzMVx1MDQ0Qlx1MDQ0MVx1MDQ0Mlx1MDQ0MFx1MDQ0Qlx1MDQzNSBucG0tXHUwNDNGXHUwNDMwXHUwNDNBXHUwNDM1XHUwNDQyXHUwNDRCIFx1MDQzMVx1MDQzNVx1MDQzNyBcdTA0MzdcdTA0MzBcdTA0MzJcdTA0MzhcdTA0NDFcdTA0MzhcdTA0M0NcdTA0M0VcdTA0NDFcdTA0NDJcdTA0MzVcdTA0MzknLCBhY3Rpb246ICdcdTA0MjFcdTA0M0NcdTA0M0VcdTA0NDJcdTA0NDBcdTA0MzVcdTA0NDJcdTA0NEMgXHUwNDNGXHUwNDMwXHUwNDNBXHUwNDM1XHUwNDQyXHUwNDRCJyB9LFxuICB0aGVtZToge1xuICAgIG91dGxpbmU6ICdcdTA0MURcdTA0MzAgXHUwNDREXHUwNDQyXHUwNDNFXHUwNDM5IFx1MDQ0MVx1MDQ0Mlx1MDQ0MFx1MDQzMFx1MDQzRFx1MDQzOFx1MDQ0Nlx1MDQzNScsXG4gICAgcHJldjogJ1x1MDQxRlx1MDQ0MFx1MDQzNVx1MDQzNFx1MDQ0Qlx1MDQzNFx1MDQ0M1x1MDQ0OVx1MDQzMFx1MDQ0RicsXG4gICAgbmV4dDogJ1x1MDQyMVx1MDQzQlx1MDQzNVx1MDQzNFx1MDQ0M1x1MDQ0RVx1MDQ0OVx1MDQzMFx1MDQ0RicsXG4gICAgcmV0dXJuVG9Ub3A6ICdcdTA0MURcdTA0MzBcdTA0MzJcdTA0MzVcdTA0NDBcdTA0NDUnLFxuICAgIG1lbnU6ICdcdTA0MUNcdTA0MzVcdTA0M0RcdTA0NEUnLFxuICAgIGRhcmtNb2RlU3dpdGNoOiAnXHUwNDIyXHUwNDM1XHUwNDNDXHUwNDMwJyxcbiAgICBsaWdodE1vZGVUaXRsZTogJ1x1MDQyMVx1MDQzMlx1MDQzNVx1MDQ0Mlx1MDQzQlx1MDQzMFx1MDQ0RiBcdTA0NDJcdTA0MzVcdTA0M0NcdTA0MzAnLFxuICAgIGRhcmtNb2RlVGl0bGU6ICdcdTA0MjJcdTA0NTFcdTA0M0NcdTA0M0RcdTA0MzBcdTA0NEYgXHUwNDQyXHUwNDM1XHUwNDNDXHUwNDMwJyxcbiAgICBsYW5nTWVudTogJ1x1MDQyRlx1MDQzN1x1MDQ0Qlx1MDQzQScsXG4gICAgbm90Rm91bmQ6IHsgdGl0bGU6ICdcdTA0MjFcdTA0NDJcdTA0NDBcdTA0MzBcdTA0M0RcdTA0MzhcdTA0NDZcdTA0MzAgXHUwNDNEXHUwNDM1IFx1MDQzRFx1MDQzMFx1MDQzOVx1MDQzNFx1MDQzNVx1MDQzRFx1MDQzMCcsIHF1b3RlOiAnXHUwNDIyXHUwNDMwXHUwNDNBXHUwNDNFXHUwNDM5IFx1MDQ0MVx1MDQ0Mlx1MDQ0MFx1MDQzMFx1MDQzRFx1MDQzOFx1MDQ0Nlx1MDQ0QiBcdTA0M0RcdTA0MzVcdTA0NDIuJywgbGlua1RleHQ6ICdcdTA0MURcdTA0MzAgXHUwNDMzXHUwNDNCXHUwNDMwXHUwNDMyXHUwNDNEXHUwNDQzXHUwNDRFJyB9LFxuICB9LFxuICBzZWFyY2g6IHtcbiAgICBidXR0b246ICdcdTA0MUZcdTA0M0VcdTA0MzhcdTA0NDFcdTA0M0EnLFxuICAgIG5vUmVzdWx0czogJ1x1MDQxRFx1MDQzOFx1MDQ0N1x1MDQzNVx1MDQzM1x1MDQzRSBcdTA0M0RcdTA0MzUgXHUwNDNEXHUwNDMwXHUwNDM5XHUwNDM0XHUwNDM1XHUwNDNEXHUwNDNFJyxcbiAgICByZXNldDogJ1x1MDQyMVx1MDQzMVx1MDQ0MFx1MDQzRVx1MDQ0MVx1MDQzOFx1MDQ0Mlx1MDQ0QycsXG4gICAgc2VsZWN0OiAnXHUwNDMyXHUwNDRCXHUwNDMxXHUwNDQwXHUwNDMwXHUwNDQyXHUwNDRDJyxcbiAgICBuYXZpZ2F0ZTogJ1x1MDQzRFx1MDQzMFx1MDQzMlx1MDQzOFx1MDQzM1x1MDQzMFx1MDQ0Nlx1MDQzOFx1MDQ0RicsXG4gICAgY2xvc2U6ICdcdTA0MzdcdTA0MzBcdTA0M0FcdTA0NDBcdTA0NEJcdTA0NDJcdTA0NEMnLFxuICB9LFxuICBkb2NzOiB7IHNpZ25hdHVyZTogJ1x1MDQyMVx1MDQzOFx1MDQzM1x1MDQzRFx1MDQzMFx1MDQ0Mlx1MDQ0M1x1MDQ0MFx1MDQzMCcsIHBhcmFtczogJ1x1MDQxRlx1MDQzMFx1MDQ0MFx1MDQzMFx1MDQzQ1x1MDQzNVx1MDQ0Mlx1MDQ0MFx1MDQ0QicsIGNvZGVzOiAnXHUwNDFBXHUwNDNFXHUwNDM0XHUwNDRCIFx1MDQzRVx1MDQ0OFx1MDQzOFx1MDQzMVx1MDQzRVx1MDQzQScsIGV4YW1wbGVzOiAnXHUwNDFGXHUwNDQwXHUwNDM4XHUwNDNDXHUwNDM1XHUwNDQwXHUwNDRCJywgZXhhbXBsZTogJ1x1MDQxRlx1MDQ0MFx1MDQzOFx1MDQzQ1x1MDQzNVx1MDQ0MCcsIHNlZTogJ1x1MDQyMVx1MDQzQy4gXHUwNDQyXHUwNDMwXHUwNDNBXHUwNDM2XHUwNDM1Jywgbm90ZXM6ICdcdTA0MUVcdTA0NDFcdTA0M0VcdTA0MzFcdTA0MzVcdTA0M0RcdTA0M0RcdTA0M0VcdTA0NDFcdTA0NDJcdTA0MzgnIH0sXG4gIGRlbW86IHtcbiAgICB2ZXJzaW9uOiAnXHUwNDEyXHUwNDM1XHUwNDQwXHUwNDQxXHUwNDM4XHUwNDRGJyxcbiAgICBsb2NhbDogJ1x1MDQzQlx1MDQzRVx1MDQzQVx1MDQzMFx1MDQzQlx1MDQ0Q1x1MDQzRFx1MDQzMFx1MDQ0RicsXG4gICAgdW5wdWJsaXNoZWQ6ICdcdTA0M0ZcdTA0MzBcdTA0M0FcdTA0MzVcdTA0NDIgXHUwNDM1XHUwNDQ5XHUwNDUxIFx1MDQzRFx1MDQzNSBcdTA0M0VcdTA0M0ZcdTA0NDNcdTA0MzFcdTA0M0JcdTA0MzhcdTA0M0FcdTA0M0VcdTA0MzJcdTA0MzBcdTA0M0QgXHUwNDNEXHUwNDMwIG5wbScsXG4gICAgbG9hZGluZzogJ1x1MDQxN1x1MDQzMFx1MDQzM1x1MDQ0MFx1MDQ0M1x1MDQzN1x1MDQzQVx1MDQzMFx1MjAyNicsXG4gICAgZmFpbGVkOiAnXHUwNDFEXHUwNDM1IFx1MDQ0M1x1MDQzNFx1MDQzMFx1MDQzQlx1MDQzRVx1MDQ0MVx1MDQ0QyBcdTA0MzdcdTA0MzBcdTA0MzNcdTA0NDBcdTA0NDNcdTA0MzdcdTA0MzhcdTA0NDJcdTA0NEMnLFxuICB9LFxufSBzYXRpc2ZpZXMgTGFuZ0ZpbGU7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2tpbGtlbm55L3d3dy9ucG0tcGFja2FnZXMvc2l0ZS8udml0ZXByZXNzL2kxOG5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2tpbGtlbm55L3d3dy9ucG0tcGFja2FnZXMvc2l0ZS8udml0ZXByZXNzL2kxOG4vZW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUva2lsa2Vubnkvd3d3L25wbS1wYWNrYWdlcy9zaXRlLy52aXRlcHJlc3MvaTE4bi9lbi50c1wiO2ltcG9ydCB0eXBlIHsgTGFuZ0ZpbGUgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb2RlOiAnZW4nLFxuICBsYWJlbDogJ0VuZ2xpc2gnLFxuICBsYW5nOiAnZW4tVVMnLFxuICBkZXNjcmlwdGlvbjogJ1RpbnkgemVyby1kZXBlbmRlbmN5IG5wbSBwYWNrYWdlcycsXG4gIG5hdjogeyBwYWNrYWdlczogJ1BhY2thZ2VzJyB9LFxuICBob21lOiB7IHRhZ2xpbmU6ICdUaW55LCBmYXN0LCB6ZXJvLWRlcGVuZGVuY3kgbnBtIHBhY2thZ2VzJywgYWN0aW9uOiAnQnJvd3NlIHBhY2thZ2VzJyB9LFxuICB0aGVtZToge1xuICAgIG91dGxpbmU6ICdPbiB0aGlzIHBhZ2UnLFxuICAgIHByZXY6ICdQcmV2aW91cyBwYWdlJyxcbiAgICBuZXh0OiAnTmV4dCBwYWdlJyxcbiAgICByZXR1cm5Ub1RvcDogJ1JldHVybiB0byB0b3AnLFxuICAgIG1lbnU6ICdNZW51JyxcbiAgICBkYXJrTW9kZVN3aXRjaDogJ0FwcGVhcmFuY2UnLFxuICAgIGxpZ2h0TW9kZVRpdGxlOiAnU3dpdGNoIHRvIGxpZ2h0IHRoZW1lJyxcbiAgICBkYXJrTW9kZVRpdGxlOiAnU3dpdGNoIHRvIGRhcmsgdGhlbWUnLFxuICAgIGxhbmdNZW51OiAnQ2hhbmdlIGxhbmd1YWdlJyxcbiAgICBub3RGb3VuZDogeyB0aXRsZTogJ1BhZ2Ugbm90IGZvdW5kJywgcXVvdGU6ICdUaGlzIHBhZ2UgZG9lcyBub3QgZXhpc3QuJywgbGlua1RleHQ6ICdUYWtlIG1lIGhvbWUnIH0sXG4gIH0sXG4gIHNlYXJjaDoge1xuICAgIGJ1dHRvbjogJ1NlYXJjaCcsXG4gICAgbm9SZXN1bHRzOiAnTm8gcmVzdWx0cyBmb3InLFxuICAgIHJlc2V0OiAnUmVzZXQgc2VhcmNoJyxcbiAgICBzZWxlY3Q6ICd0byBzZWxlY3QnLFxuICAgIG5hdmlnYXRlOiAndG8gbmF2aWdhdGUnLFxuICAgIGNsb3NlOiAndG8gY2xvc2UnLFxuICB9LFxuICBkb2NzOiB7IHNpZ25hdHVyZTogJ1NpZ25hdHVyZScsIHBhcmFtczogJ1BhcmFtZXRlcnMnLCBjb2RlczogJ0Vycm9yIGNvZGVzJywgZXhhbXBsZXM6ICdFeGFtcGxlcycsIGV4YW1wbGU6ICdFeGFtcGxlJywgc2VlOiAnU2VlIGFsc28nLCBub3RlczogJ05vdGVzJyB9LFxuICBkZW1vOiB7XG4gICAgdmVyc2lvbjogJ1ZlcnNpb24nLFxuICAgIGxvY2FsOiAnbG9jYWwnLFxuICAgIHVucHVibGlzaGVkOiAnbm90IHB1Ymxpc2hlZCB0byBucG0geWV0JyxcbiAgICBsb2FkaW5nOiAnTG9hZGluZ1x1MjAyNicsXG4gICAgZmFpbGVkOiAnRmFpbGVkIHRvIGxvYWQnLFxuICB9LFxufSBzYXRpc2ZpZXMgTGFuZ0ZpbGU7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2tpbGtlbm55L3d3dy9ucG0tcGFja2FnZXMvc2l0ZS8udml0ZXByZXNzL2kxOG5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2tpbGtlbm55L3d3dy9ucG0tcGFja2FnZXMvc2l0ZS8udml0ZXByZXNzL2kxOG4vemgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUva2lsa2Vubnkvd3d3L25wbS1wYWNrYWdlcy9zaXRlLy52aXRlcHJlc3MvaTE4bi96aC50c1wiO2ltcG9ydCB0eXBlIHsgTGFuZ0ZpbGUgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb2RlOiAnemgnLFxuICBsYWJlbDogJ1x1N0I4MFx1NEY1M1x1NEUyRFx1NjU4NycsXG4gIGxhbmc6ICd6aC1DTicsXG4gIGRlc2NyaXB0aW9uOiAnXHU1QzBGXHU1REU3XHUzMDAxXHU5NkY2XHU0RjlEXHU4RDU2XHU3Njg0IG5wbSBcdThGNkZcdTRFRjZcdTUzMDUnLFxuICBuYXY6IHsgcGFja2FnZXM6ICdcdThGNkZcdTRFRjZcdTUzMDUnIH0sXG4gIGhvbWU6IHsgdGFnbGluZTogJ1x1NUMwRlx1NURFN1x1MzAwMVx1NUZFQlx1OTAxRlx1MzAwMVx1OTZGNlx1NEY5RFx1OEQ1Nlx1NzY4NCBucG0gXHU4RjZGXHU0RUY2XHU1MzA1JywgYWN0aW9uOiAnXHU2RDRGXHU4OUM4XHU4RjZGXHU0RUY2XHU1MzA1JyB9LFxuICB0aGVtZToge1xuICAgIG91dGxpbmU6ICdcdTY3MkNcdTk4NzVcdTc2RUVcdTVGNTUnLFxuICAgIHByZXY6ICdcdTRFMEFcdTRFMDBcdTk4NzUnLFxuICAgIG5leHQ6ICdcdTRFMEJcdTRFMDBcdTk4NzUnLFxuICAgIHJldHVyblRvVG9wOiAnXHU4RkQ0XHU1NkRFXHU5ODc2XHU5MEU4JyxcbiAgICBtZW51OiAnXHU4M0RDXHU1MzU1JyxcbiAgICBkYXJrTW9kZVN3aXRjaDogJ1x1NEUzQlx1OTg5OCcsXG4gICAgbGlnaHRNb2RlVGl0bGU6ICdcdTUyMDdcdTYzNjJcdTUyMzBcdTZENDVcdTgyNzJcdTZBMjFcdTVGMEYnLFxuICAgIGRhcmtNb2RlVGl0bGU6ICdcdTUyMDdcdTYzNjJcdTUyMzBcdTZERjFcdTgyNzJcdTZBMjFcdTVGMEYnLFxuICAgIGxhbmdNZW51OiAnXHU4QkVEXHU4QTAwJyxcbiAgICBub3RGb3VuZDogeyB0aXRsZTogJ1x1OTg3NVx1OTc2Mlx1NjcyQVx1NjI3RVx1NTIzMCcsIHF1b3RlOiAnXHU4QkU1XHU5ODc1XHU5NzYyXHU0RTBEXHU1QjU4XHU1NzI4XHUzMDAyJywgbGlua1RleHQ6ICdcdThGRDRcdTU2REVcdTk5OTZcdTk4NzUnIH0sXG4gIH0sXG4gIHNlYXJjaDoge1xuICAgIGJ1dHRvbjogJ1x1NjQxQ1x1N0QyMicsXG4gICAgbm9SZXN1bHRzOiAnXHU2Q0ExXHU2NzA5XHU2MjdFXHU1MjMwXHU3RUQzXHU2NzlDJyxcbiAgICByZXNldDogJ1x1NkUwNVx1OTY2NCcsXG4gICAgc2VsZWN0OiAnXHU5MDA5XHU2MkU5JyxcbiAgICBuYXZpZ2F0ZTogJ1x1NTIwN1x1NjM2MicsXG4gICAgY2xvc2U6ICdcdTUxNzNcdTk1RUQnLFxuICB9LFxuICBkb2NzOiB7IHNpZ25hdHVyZTogJ1x1N0I3RVx1NTQwRCcsIHBhcmFtczogJ1x1NTNDMlx1NjU3MCcsIGNvZGVzOiAnXHU5NTE5XHU4QkVGXHU0RUUzXHU3ODAxJywgZXhhbXBsZXM6ICdcdTc5M0FcdTRGOEInLCBleGFtcGxlOiAnXHU3OTNBXHU0RjhCJywgc2VlOiAnXHU1M0U2XHU4QkY3XHU1M0MyXHU5NjA1Jywgbm90ZXM6ICdcdTZDRThcdTYxMEZcdTRFOEJcdTk4NzknIH0sXG4gIGRlbW86IHtcbiAgICB2ZXJzaW9uOiAnXHU3MjQ4XHU2NzJDJyxcbiAgICBsb2NhbDogJ1x1NjcyQ1x1NTczMCcsXG4gICAgdW5wdWJsaXNoZWQ6ICdcdTVDMUFcdTY3MkFcdTUzRDFcdTVFMDNcdTUyMzAgbnBtJyxcbiAgICBsb2FkaW5nOiAnXHU1MkEwXHU4RjdEXHU0RTJEXHUyMDI2JyxcbiAgICBmYWlsZWQ6ICdcdTUyQTBcdThGN0RcdTU5MzFcdThEMjUnLFxuICB9LFxufSBzYXRpc2ZpZXMgTGFuZ0ZpbGU7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2tpbGtlbm55L3d3dy9ucG0tcGFja2FnZXMvc2l0ZS8udml0ZXByZXNzL2kxOG5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2tpbGtlbm55L3d3dy9ucG0tcGFja2FnZXMvc2l0ZS8udml0ZXByZXNzL2kxOG4vaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUva2lsa2Vubnkvd3d3L25wbS1wYWNrYWdlcy9zaXRlLy52aXRlcHJlc3MvaTE4bi9pbmRleC50c1wiOy8vIFx1MDQyRlx1MDQzN1x1MDQ0Qlx1MDQzQVx1MDQzOCBcdTA0NDFcdTA0MzBcdTA0MzlcdTA0NDJcdTA0MzAuIFx1MDQxRFx1MDQzRVx1MDQzMlx1MDQ0Qlx1MDQzOSBcdTA0NEZcdTA0MzdcdTA0NEJcdTA0M0E6IFx1MDQ0MVx1MDQzRVx1MDQzN1x1MDQzNFx1MDQzMFx1MDQ0Mlx1MDQ0QyBpMThuLzxcdTA0M0FcdTA0M0VcdTA0MzQ+LnRzIFx1MDQzOCBcdTA0MzRcdTA0M0VcdTA0MzFcdTA0MzBcdTA0MzJcdTA0MzhcdTA0NDJcdTA0NEMgXHUwNDM1XHUwNDMzXHUwNDNFIFx1MDQ0MVx1MDQ0RVx1MDQzNFx1MDQzMC5cbi8vIFx1MDQyMVx1MDQ0Mlx1MDQ0MFx1MDQzMFx1MDQzRFx1MDQzOFx1MDQ0Nlx1MDQ0QiBcdTA0M0RcdTA0MzAgXHUwNDNEXHUwNDNFXHUwNDMyXHUwNDNFXHUwNDNDIFx1MDQ0Rlx1MDQzN1x1MDQ0Qlx1MDQzQVx1MDQzNSBcdTA0M0ZcdTA0M0VcdTA0NEZcdTA0MzJcdTA0NEZcdTA0NDJcdTA0NDFcdTA0NEYgXHUwNDQxXHUwNDQwXHUwNDMwXHUwNDM3XHUwNDQzIFx1MjAxNCBcdTA0NDEgXHUwNDMwXHUwNDNEXHUwNDMzXHUwNDNCXHUwNDM4XHUwNDM5XHUwNDQxXHUwNDNBXHUwNDM4XHUwNDNDIFx1MDQ0Mlx1MDQzNVx1MDQzQVx1MDQ0MVx1MDQ0Mlx1MDQzRVx1MDQzQywgXHUwNDNGXHUwNDNFXHUwNDNBXHUwNDMwIFx1MDQzRFx1MDQzNSBcdTA0MzRcdTA0M0VcdTA0MzFcdTA0MzBcdTA0MzJcdTA0M0JcdTA0MzVcdTA0M0RcdTA0NEIgXHUwNDMxXHUwNDNCXHUwNDNFXHUwNDNBXHUwNDM4IDo6OiA8XHUwNDNBXHUwNDNFXHUwNDM0PlxuaW1wb3J0IHJ1IGZyb20gJy4vcnUnO1xuaW1wb3J0IGVuIGZyb20gJy4vZW4nO1xuaW1wb3J0IHpoIGZyb20gJy4vemgnO1xuaW1wb3J0IHR5cGUgeyBMYW5nRmlsZSB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgbGFuZ3M6IExhbmdGaWxlW10gPSBbcnUsIGVuLCB6aF07XG5cbi8vIFx1MDQyRlx1MDQzN1x1MDQ0Qlx1MDQzQSBcdTA0M0ZcdTA0M0UgXHUwNDQzXHUwNDNDXHUwNDNFXHUwNDNCXHUwNDQ3XHUwNDMwXHUwNDNEXHUwNDM4XHUwNDRFIFx1MjAxNCBcdTA0MzFcdTA0MzVcdTA0MzcgXHUwNDNGXHUwNDQwXHUwNDM1XHUwNDQ0XHUwNDM4XHUwNDNBXHUwNDQxXHUwNDMwIFx1MDQzMiBVUkxcbmV4cG9ydCBjb25zdCBkZWZhdWx0TGFuZyA9ICdydSc7XG5cbi8vIFx1MDQyRlx1MDQzN1x1MDQ0Qlx1MDQzQSwgXHUwNDQyXHUwNDM1XHUwNDNBXHUwNDQxXHUwNDQyIFx1MDQzQVx1MDQzRVx1MDQ0Mlx1MDQzRVx1MDQ0MFx1MDQzRVx1MDQzM1x1MDQzRSBcdTA0M0ZcdTA0M0VcdTA0M0FcdTA0MzBcdTA0MzdcdTA0NEJcdTA0MzJcdTA0MzBcdTA0MzVcdTA0NDJcdTA0NDFcdTA0NEYsIFx1MDQzNVx1MDQ0MVx1MDQzQlx1MDQzOCBcdTA0M0ZcdTA0MzVcdTA0NDBcdTA0MzVcdTA0MzJcdTA0M0VcdTA0MzRcdTA0MzAgXHUwNDNEXHUwNDM1XHUwNDQyXG5leHBvcnQgY29uc3QgZmFsbGJhY2tMYW5nID0gJ2VuJztcblxuZXhwb3J0IGNvbnN0IHByZWZpeCA9IChjb2RlOiBzdHJpbmcpID0+IChjb2RlID09PSBkZWZhdWx0TGFuZyA/ICcnIDogYC8ke2NvZGV9YCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBsYW5nQnlIdG1sTGFuZyhsYW5nOiBzdHJpbmcpOiBMYW5nRmlsZSB7XG4gIHJldHVybiBsYW5ncy5maW5kKChsKSA9PiBsLmxhbmcgPT09IGxhbmcpID8/IGxhbmdzLmZpbmQoKGwpID0+IGwuY29kZSA9PT0gZmFsbGJhY2tMYW5nKSE7XG59XG5cbmV4cG9ydCB0eXBlIHsgTGFuZ0ZpbGUgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUva2lsa2Vubnkvd3d3L25wbS1wYWNrYWdlcy9zaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9raWxrZW5ueS93d3cvbnBtLXBhY2thZ2VzL3NpdGUvW3BhZ2VdLnBhdGhzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2tpbGtlbm55L3d3dy9ucG0tcGFja2FnZXMvc2l0ZS8lNUJwYWdlJTVELnBhdGhzLnRzXCI7Ly8gXHUwNDEyXHUwNDQxXHUwNDM1IFx1MDQ0MVx1MDQ0Mlx1MDQ0MFx1MDQzMFx1MDQzRFx1MDQzOFx1MDQ0Nlx1MDQ0QiBcdTA0NDFcdTA0MzBcdTA0MzlcdTA0NDJcdTA0MzAgXHUwNDQxXHUwNDNFXHUwNDM3XHUwNDM0XHUwNDMwXHUwNDRFXHUwNDQyXHUwNDQxXHUwNDRGIFx1MDQzOFx1MDQzNyBcdTA0M0VcdTA0MzRcdTA0M0RcdTA0M0VcdTA0MzNcdTA0M0UgXHUwNDQ4XHUwNDMwXHUwNDMxXHUwNDNCXHUwNDNFXHUwNDNEXHUwNDMwIFtwYWdlXS5tZCBcdTIwMTQgXHUwNDQxXHUwNDNDLiAudml0ZXByZXNzL2RvY3MvY29udGVudC50c1xuaW1wb3J0IHsgYWxsUGFnZXMgfSBmcm9tICcuLy52aXRlcHJlc3MvZG9jcy9jb250ZW50JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBwYXRoczogYWxsUGFnZXMsXG59O1xuIl0sCiAgIm1hcHBp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LEtBQUssVUFBVSxHQUFHLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQUEsWUFBZSxJQUFJLElBQUksRUFBRSxJQUFJLEdBQUcsRUFDMUgsS0FBSyxJQUFJO0FBQ1osU0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBLGFBSUksS0FBSyxVQUFVLEVBQUUsS0FBSyxPQUFPLENBQUM7QUFBQTtBQUFBO0FBQUEsY0FHN0IsS0FBSyxVQUFVLEVBQUUsS0FBSyxNQUFNLENBQUM7QUFBQSxjQUM3QixJQUFJLElBQUksU0FBUyxDQUFDLEVBQUUsSUFBSTtBQUFBO0FBQUEsRUFFcEMsUUFBUTtBQUFBO0FBQUE7QUFHVjtBQVFPLFNBQVMsV0FBd0I7QUFDdEMsUUFBTSxRQUFxQixDQUFDO0FBQzVCLGFBQVcsS0FBSyxPQUFPO0FBQ3JCLFVBQU0sT0FBTyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQztBQUNuQyxVQUFNLEtBQUssQ0FBQyxNQUFlLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLO0FBQ25ELFVBQU0sS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLEdBQUcsT0FBTyxFQUFFLEdBQUcsU0FBUyxLQUFLLENBQUMsRUFBRSxDQUFDO0FBQzlELGVBQVcsT0FBTyxVQUFVO0FBQzFCLFlBQU0sS0FBSztBQUFBLFFBQ1QsUUFBUSxFQUFFLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxRQUFRLEVBQUU7QUFBQSxRQUN4QyxTQUFTLEtBQUssSUFBSSxNQUFNLE9BQU8sS0FBSyxHQUFHLElBQUksSUFBSSxXQUFXLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFBQSxNQUN0RSxDQUFDO0FBQ0QsaUJBQVcsV0FBVyxJQUFJLFVBQVU7QUFDbEMsbUJBQVcsS0FBSyxRQUFRLE9BQU87QUFDN0IsZ0JBQU0sT0FBTyxPQUFPLENBQUM7QUFDckIsZ0JBQU0sS0FBSztBQUFBLFlBQ1QsUUFBUSxFQUFFLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLElBQUksRUFBRSxFQUFFO0FBQUEsWUFDekQsU0FBUyxLQUFLLFFBQVEsR0FBRyxFQUFFLElBQUksR0FBRyxPQUFPLEtBQUssR0FBRyxJQUFJLElBQUksSUFBSSxRQUFRLEdBQUcsSUFBSSxJQUFJLEtBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUFBLFVBQ2pHLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0EsU0FBTztBQUNUOzs7QVEzSEEsSUFBTyxxQkFBUTtBQUFBLEVBQ2IsT0FBTztBQUNUOyIsCiAgIm5hbWVzIjogWyJtZXRhX2RlZmF1bHQiLCAibWV0YV9kZWZhdWx0Il0KfQo=
