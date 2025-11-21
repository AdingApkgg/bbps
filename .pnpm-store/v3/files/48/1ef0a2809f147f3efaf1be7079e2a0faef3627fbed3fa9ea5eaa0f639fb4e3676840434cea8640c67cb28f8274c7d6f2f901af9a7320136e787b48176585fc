'use strict';

const node_path = require('node:path');
const fs = require('node:fs/promises');
const kit = require('@nuxt/kit');
const node_url = require('node:url');
const mlly = require('mlly');
const pathe = require('pathe');
const getPortPlease = require('get-port-please');
const node_module = require('node:module');
const unimport = require('unimport');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const fs__default = /*#__PURE__*/_interopDefaultCompat(fs);

function createAddonGlobals(nuxt) {
  let unimport;
  let nitroUnimport;
  nuxt.hook("imports:context", (context) => {
    unimport = context;
  });
  nuxt.hook("nitro:init", (nitro) => {
    nitroUnimport = nitro.unimport;
  });
  return {
    name: "nuxt:eslint:import-globals",
    async getConfigs() {
      const imports = [
        ...await unimport?.getImports() || [],
        ...await nitroUnimport?.getImports() || []
      ].sort();
      return {
        configs: [
          [
            "// Set globals from imports registry",
            "{",
            `  name: 'nuxt/import-globals',`,
            "  languageOptions: {",
            `    globals: Object.fromEntries(${JSON.stringify(imports.map((i) => i.as || i.name))}.map(i => [i, 'readonly'])),`,
            `  },`,
            "}"
          ].join("\n")
        ]
      };
    }
  };
}

async function setupDevToolsIntegration(nuxt) {
  let viewerProcess;
  let viewerPort;
  let viewerUrl;
  nuxt.hook("devtools:customTabs", (tabs) => {
    tabs.push({
      name: "eslint-config",
      title: "ESLint Config",
      icon: "https://raw.githubusercontent.com/eslint/config-inspector/main/app/public/favicon.svg",
      view: viewerUrl ? {
        type: "iframe",
        src: viewerUrl
      } : {
        type: "launch",
        description: "Start ESLint config inspector to analyze the local ESLint configs",
        actions: [
          {
            label: "Launch",
            pending: !!viewerProcess,
            handle: async () => {
              const { startSubprocess } = await import('@nuxt/devtools-kit');
              const inspectorBinPath = pathe.join(
                pathe.dirname(await mlly.resolvePath(
                  "@eslint/config-inspector/package.json",
                  { url: pathe.dirname(node_url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('chunks/index.cjs', document.baseURI).href)))) }
                )),
                "bin.mjs"
              );
              viewerPort = await getPortPlease.getPort({
                portRange: [8123, 1e4],
                random: true
              });
              viewerProcess = startSubprocess(
                {
                  command: "node",
                  args: [inspectorBinPath, "--no-open"],
                  cwd: nuxt.options.rootDir,
                  env: {
                    PORT: viewerPort.toString()
                  }
                },
                {
                  id: "eslint-config-inspector",
                  name: "ESLint Config Viewer"
                },
                nuxt
              );
              nuxt.callHook("devtools:customTabs:refresh");
              const url = `http://localhost:${viewerPort}`;
              for (let i = 0; i < 100; i++) {
                if (await fetch(url).then((r) => r.ok).catch(() => false))
                  break;
                await new Promise((resolve) => setTimeout(resolve, 500));
              }
              await new Promise((resolve) => setTimeout(resolve, 2e3));
              viewerUrl = url;
            }
          }
        ]
      }
    });
  });
}

async function initRootESLintConfig(nuxt, generateConfigPath) {
  const { findUp } = await import('find-up');
  const hasFlatConfig = await findUp(
    [
      "eslint.config.js",
      "eslint.config.mjs",
      "eslint.config.cjs",
      "eslint.config.ts",
      "eslint.config.mts",
      "eslint.config.cts"
    ],
    {
      cwd: nuxt.options.rootDir
    }
  );
  if (hasFlatConfig)
    return;
  const targetPath = pathe.join(nuxt.options.rootDir, "eslint.config.mjs");
  let relativeDistPath = pathe.relative(nuxt.options.rootDir, generateConfigPath);
  if (!relativeDistPath.startsWith("./") && !relativeDistPath.startsWith("../"))
    relativeDistPath = "./" + relativeDistPath;
  await fs__default.writeFile(
    targetPath,
    [
      "// @ts-check",
      `import withNuxt from '${relativeDistPath}'`,
      "",
      "export default withNuxt(",
      "  // Your custom configs here",
      ")",
      ""
    ].join("\n"),
    "utf-8"
  );
  kit.logger.success(`ESLint config file created at ${targetPath}`);
  kit.logger.info(`If you have .eslintrc or .eslintignore files, you might want to migrate them to the new config file`);
}

function getDirs(nuxt) {
  const dirs = {
    pages: [],
    composables: [],
    components: [],
    componentsPrefixed: [],
    layouts: [],
    plugins: [],
    middleware: [],
    modules: [],
    servers: [],
    root: [nuxt.options.rootDir],
    src: []
  };
  for (const layer of nuxt.options._layers) {
    const r = (t) => pathe.relative(nuxt.options.rootDir, pathe.resolve(layer.config.srcDir, t.replace(/^~[/\\]/, "")));
    dirs.src.push(r(""));
    dirs.pages.push(r(nuxt.options.dir.pages || "pages"));
    dirs.layouts.push(r(nuxt.options.dir.layouts || "layouts"));
    dirs.plugins.push(r(nuxt.options.dir.plugins || "plugins"));
    dirs.middleware.push(r(nuxt.options.dir.middleware || "middleware"));
    dirs.modules.push(r(nuxt.options.dir.modules || "modules"));
    dirs.composables.push(r("composables"));
    dirs.composables.push(r("utils"));
    for (const dir of layer.config.imports?.dirs ?? []) {
      if (dir)
        dirs.composables.push(r(dir));
    }
    if (layer.config.components && layer.config.components !== true) {
      const options = Array.isArray(layer.config.components) ? { dirs: layer.config.components } : layer.config.components;
      for (const dir of options.dirs || []) {
        if (typeof dir === "string")
          dirs.components.push(r(dir));
        else if (dir && "path" in dir && typeof dir.path === "string") {
          dirs.components.push(r(dir.path));
          if (dir.prefix)
            dirs.componentsPrefixed.push(r(dir.path));
        }
      }
    } else {
      dirs.components.push(r("components"));
    }
  }
  return dirs;
}

const r = kit.createResolver((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('chunks/index.cjs', document.baseURI).href)));
async function generateESLintConfig(options, nuxt, addons) {
  const importLines = [];
  const configItems = [];
  const config = {
    standalone: true,
    ...typeof options.config !== "boolean" ? options.config || {} : {}
  };
  let {
    configFile = node_path.join(nuxt.options.buildDir, "eslint.config.mjs")
  } = config;
  configFile = node_path.resolve(nuxt.options.rootDir, configFile);
  const configDir = node_path.dirname(configFile);
  importLines.push(
    {
      from: "eslint-typegen",
      name: "default",
      as: "typegen"
    },
    {
      from: "@nuxt/eslint-config/flat",
      name: "createConfigForNuxt"
    },
    {
      from: "@nuxt/eslint-config/flat",
      name: "defineFlatConfigs"
    },
    {
      from: "@nuxt/eslint-config/flat",
      name: "resolveOptions"
    },
    {
      from: "url",
      name: "fileURLToPath"
    }
  );
  const dirs = getDirs(nuxt) || {};
  for (const addon of addons) {
    const resolved = await addon.getConfigs();
    if (resolved?.imports)
      importLines.push(...resolved.imports);
    if (resolved?.configs)
      configItems.push(...resolved.configs);
  }
  function relativeWithDot(path) {
    const r2 = pathe.relative(configDir, path);
    return r2.startsWith(".") ? r2 : "./" + r2;
  }
  const imports = await Promise.all(importLines.map(async (line) => {
    return {
      ...line,
      from: line.from.match(/^\w+:/) || node_module.builtinModules.includes(line.from) ? line.from : relativeWithDot(await r.resolvePath(line.from))
    };
  }));
  const code = [
    "// ESLint config generated by Nuxt",
    '/// <reference path="./eslint-typegen.d.ts" />',
    "/* eslint-disable */",
    "// @ts-nocheck",
    "",
    unimport.stringifyImports(imports, false),
    "",
    "const r = (...args) => fileURLToPath(new URL(...args, import.meta.url))",
    "",
    "export { defineFlatConfigs }",
    "",
    `export const options = resolveOptions({`,
    `  features: ${JSON.stringify(config, null, 2)},`,
    `  dirs: {`,
    ...Object.entries(dirs).map(([key, value]) => {
      return `    ${key}: [${value.map(
        (v) => key === "root" ? `r(${JSON.stringify(relativeWithDot(v))})` : JSON.stringify(v)
      ).join(", ")}],`;
    }),
    `}`,
    `})`,
    "",
    `export const configs = createConfigForNuxt(options)`,
    ...configItems.length ? [
      "",
      `configs.append(`,
      configItems.join(",\n\n"),
      `)`,
      ""
    ] : [],
    "export function withNuxt(...customs) {",
    "  return configs",
    "    .clone()",
    "    .append(...customs)",
    '    .onResolved(configs => typegen(configs, { dtsPath: r("./eslint-typegen.d.ts"), augmentFlatConfigUtils: true }))',
    "}",
    "",
    "export default withNuxt"
  ].join("\n");
  return {
    code,
    configFile
  };
}

const ESLINT_CONFIG_DTS = [
  'import type { FlatConfigComposer } from "eslint-flat-config-utils"',
  'import { defineFlatConfigs } from "@nuxt/eslint-config/flat"',
  'import type { NuxtESLintConfigOptionsResolved } from "@nuxt/eslint-config/flat"',
  "",
  "declare const configs: FlatConfigComposer",
  "declare const options: NuxtESLintConfigOptionsResolved",
  "declare const withNuxt: typeof defineFlatConfigs",
  "export default withNuxt",
  "export { withNuxt, defineFlatConfigs, configs, options }"
].join("\n");
async function setupConfigGen(options, nuxt) {
  const {
    autoInit = true
  } = typeof options.config !== "boolean" ? options.config || {} : {};
  const defaultAddons = [
    createAddonGlobals(nuxt)
  ];
  nuxt.hook("prepare:types", ({ declarations }) => {
    declarations.push('/// <reference path="./eslint-typegen.d.ts" />');
  });
  let _configFile = void 0;
  async function writeConfigFile() {
    const addons = [
      ...defaultAddons
    ];
    await nuxt.callHook("eslint:config:addons", addons);
    const { code, configFile } = await generateESLintConfig(options, nuxt, addons);
    await fs__default.mkdir(node_path.dirname(configFile), { recursive: true });
    await fs__default.writeFile(configFile, code, "utf-8");
    _configFile = configFile;
  }
  kit.addTemplate({
    filename: "eslint.config.d.mts",
    write: true,
    getContents() {
      return ESLINT_CONFIG_DTS;
    }
  });
  setupDevToolsIntegration(nuxt);
  await writeConfigFile();
  nuxt.hook("builder:generateApp", () => {
    writeConfigFile();
  });
  if (autoInit) {
    await initRootESLintConfig(nuxt, _configFile);
  }
}

exports.setupConfigGen = setupConfigGen;
