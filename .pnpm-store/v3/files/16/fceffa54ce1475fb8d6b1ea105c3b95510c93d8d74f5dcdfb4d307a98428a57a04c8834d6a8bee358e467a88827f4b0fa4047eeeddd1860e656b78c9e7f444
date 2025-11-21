import { existsSync } from 'node:fs';
import fs, { stat, readFile } from 'node:fs/promises';
import { relative, resolve as resolve$1, dirname, basename, join } from 'node:path';
import process from 'node:process';
import cac from 'cac';
import fg from 'fast-glob';
import { getPort } from 'get-port-please';
import open from 'open';
import c from 'picocolors';
import { ConfigArray } from '@eslint/config-array';
import { configArrayFindFiles } from '@voxpelli/config-array-find-files';
import { bundleRequire } from 'bundle-require';
import { findUp } from 'find-up';
import { resolve } from 'mlly';
import { Minimatch } from 'minimatch';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { createApp, eventHandler, serveStatic, toNodeListener } from 'h3';
import { lookup } from 'mrmime';
import chokidar from 'chokidar';
import { WebSocketServer } from 'ws';

const minimatchOpts = { dot: true };
const _matchInstances = /* @__PURE__ */ new Map();
function minimatch(file, pattern) {
  let m = _matchInstances.get(pattern);
  if (!m) {
    m = new Minimatch(pattern, minimatchOpts);
    _matchInstances.set(pattern, m);
  }
  return m.match(file);
}
function getMatchedGlobs(file, glob) {
  const globs = (Array.isArray(glob) ? glob : [glob]).flat();
  return globs.filter((glob2) => minimatch(file, glob2)).flat();
}
const META_KEYS = /* @__PURE__ */ new Set(["name", "index"]);
function isIgnoreOnlyConfig(config) {
  const keys = Object.keys(config).filter((i) => !META_KEYS.has(i));
  return keys.length === 1 && keys[0] === "ignores";
}
function matchFile(filepath, configs, ignoreOnlyConfigs) {
  const globalIgnored = ignoreOnlyConfigs.flatMap((config) => getMatchedGlobs(filepath, config.ignores));
  if (globalIgnored.length) {
    return {
      filepath,
      globs: globalIgnored,
      configs: []
    };
  }
  const result = {
    filepath,
    globs: [],
    configs: []
  };
  configs.forEach((config, index) => {
    const positive = getMatchedGlobs(filepath, config.files || []);
    const negative = getMatchedGlobs(filepath, config.ignores || []);
    if (!negative.length && positive.length)
      result.configs.push(index);
    result.globs.push(
      ...positive,
      ...negative
    );
  });
  return result;
}

const configFilenames = [
  "eslint.config.js",
  "eslint.config.mjs",
  "eslint.config.cjs",
  "eslint.config.ts",
  "eslint.config.mts",
  "eslint.config.cts"
];
const legacyConfigFilenames = [
  ".eslintrc.js",
  ".eslintrc.cjs",
  ".eslintrc.yaml",
  ".eslintrc.yml",
  ".eslintrc.json"
];
const MARK_CHECK = c.green("\u2714");
const MARK_INFO = c.blue("\u2139");
const MARK_ERROR = c.red("\u2716");

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class ConfigInspectorError extends Error {
  prettyPrint() {
    console.error(MARK_ERROR, this.message);
  }
}
class ConfigPathError extends ConfigInspectorError {
  constructor(basePath, configFilenames) {
    super("Cannot find ESLint config file");
    this.basePath = basePath;
    this.configFilenames = configFilenames;
    __publicField(this, "name", "ConfigPathError");
  }
  prettyPrint() {
    console.error(MARK_ERROR, this.message, c.dim(
      `

Looked in ${c.underline(this.basePath)} and parent folders for:

 * ${this.configFilenames.join("\n * ")}`
    ));
  }
}
class ConfigPathLegacyError extends ConfigInspectorError {
  constructor(basePath, configFilename) {
    super("Found ESLint legacy config file");
    this.basePath = basePath;
    this.configFilename = configFilename;
    __publicField(this, "name", "ConfigPathLegacyError");
  }
  prettyPrint() {
    console.error(MARK_ERROR, this.message, c.dim(
      `

Encountered unsupported legacy config ${c.underline(this.configFilename)} in ${c.underline(this.basePath)}

\`@eslint/config-inspector\` only works with the new flat config format:
https://eslint.org/docs/latest/use/configure/configuration-files-new`
    ));
  }
}

async function resolveConfigPath(options) {
  let {
    cwd,
    userConfigPath,
    userBasePath
  } = options;
  if (userBasePath)
    userBasePath = resolve$1(cwd, userBasePath);
  const lookupBasePath = userBasePath || cwd;
  let configPath = userConfigPath && resolve$1(cwd, userConfigPath);
  if (!configPath) {
    configPath = await findUp(configFilenames, { cwd: lookupBasePath });
  }
  if (!configPath) {
    const legacyConfigPath = await findUp(legacyConfigFilenames, { cwd: lookupBasePath });
    throw legacyConfigPath ? new ConfigPathLegacyError(
      `${relative(cwd, dirname(legacyConfigPath))}/`,
      basename(legacyConfigPath)
    ) : new ConfigPathError(
      `${relative(cwd, lookupBasePath)}/`,
      configFilenames
    );
  }
  const basePath = userBasePath || (userConfigPath ? cwd : dirname(configPath));
  return {
    basePath,
    configPath
  };
}
async function readConfig(options) {
  const {
    chdir = true,
    globMatchedFiles: globFiles = true
  } = options;
  const resolvedConfigPath = await resolveConfigPath(options);
  const { basePath, configPath } = resolvedConfigPath;
  if (chdir && basePath !== process.cwd())
    process.chdir(basePath);
  console.log(MARK_INFO, `Reading ESLint config from`, c.blue(configPath));
  const { mod, dependencies } = await bundleRequire({
    filepath: configPath,
    cwd: basePath,
    tsconfig: false
  });
  let rawConfigs = await (mod.default ?? mod);
  if (!Array.isArray(rawConfigs))
    rawConfigs = [rawConfigs];
  rawConfigs.unshift(
    {
      name: "eslint/defaults/languages",
      languageOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        parserOptions: {}
      },
      linterOptions: {
        reportUnusedDisableDirectives: 1
      }
    },
    {
      name: "eslint/defaults/ignores",
      ignores: [
        "**/node_modules/",
        ".git/"
      ]
    },
    {
      name: "eslint/defaults/files",
      files: ["**/*.js", "**/*.mjs"]
    },
    {
      name: "eslint/defaults/files-cjs",
      files: ["**/*.cjs"],
      languageOptions: {
        sourceType: "commonjs",
        ecmaVersion: "latest"
      }
    }
  );
  const rulesMap = /* @__PURE__ */ new Map();
  const eslintPath = await resolve("eslint/use-at-your-own-risk", { url: basePath }).catch(() => null) || "eslint/use-at-your-own-risk";
  const eslintRules = await import(eslintPath).then((r) => r.default.builtinRules);
  for (const [name, rule] of eslintRules.entries()) {
    rulesMap.set(name, {
      ...rule.meta,
      name,
      plugin: "eslint",
      schema: void 0,
      messages: void 0
    });
  }
  for (const item of rawConfigs) {
    for (const [prefix, plugin] of Object.entries(item.plugins ?? {})) {
      for (const [name, rule] of Object.entries(plugin.rules ?? {})) {
        rulesMap.set(`${prefix}/${name}`, {
          ...rule.meta,
          name: `${prefix}/${name}`,
          plugin: prefix,
          schema: void 0,
          messages: void 0
        });
      }
    }
  }
  const rules = Object.fromEntries(rulesMap.entries());
  const configs = rawConfigs.map((c2, idx) => {
    return {
      ...c2,
      index: idx,
      plugins: c2.plugins ? Object.fromEntries(Object.entries(c2.plugins ?? {}).map(([prefix]) => [prefix, {}]).filter((i) => i[0])) : void 0,
      languageOptions: c2.languageOptions ? { ...c2.languageOptions, parser: c2.languageOptions.parser?.meta?.name } : void 0,
      processor: c2.processor?.meta?.name
    };
  });
  console.log(MARK_CHECK, "Loaded with", configs.length, "config items and", Object.keys(rules).length, "rules");
  const payload = {
    configs,
    rules,
    files: globFiles ? await globMatchedFiles(basePath, rawConfigs) : void 0,
    meta: {
      lastUpdate: Date.now(),
      basePath,
      configPath
    }
  };
  return {
    configs: rawConfigs,
    dependencies,
    payload
  };
}
const noopSchema = {
  merge: "replace",
  validate() {
  }
};
const flatConfigNoopSchema = {
  settings: noopSchema,
  linterOptions: noopSchema,
  language: noopSchema,
  languageOptions: noopSchema,
  processor: noopSchema,
  plugins: noopSchema,
  rules: noopSchema
};
async function globMatchedFiles(basePath, configs) {
  console.log(MARK_INFO, "Globing matched files");
  const configArray = new ConfigArray(configs, {
    basePath,
    schema: flatConfigNoopSchema
  });
  await configArray.normalize();
  const files = await configArrayFindFiles({
    basePath,
    configs: configArray
  });
  files.sort();
  const ignoreOnlyConfigs = configs.filter(isIgnoreOnlyConfig);
  return files.map((filepath) => {
    filepath = relative(basePath, filepath);
    const result = matchFile(filepath, configs, ignoreOnlyConfigs);
    if (!result.configs.length)
      return void 0;
    return result;
  }).filter((i) => i);
}

const distDir = fileURLToPath(new URL("../dist/public", import.meta.url));

const readErrorWarning = `Failed to load \`eslint.config.js\`.
Note that \`@eslint/config-inspector\` only works with the flat config format:
https://eslint.org/docs/latest/use/configure/configuration-files-new`;
async function createWsServer(options) {
  let payload;
  const port = await getPort({ port: 7811, random: true });
  const wss = new WebSocketServer({
    port
  });
  const wsClients = /* @__PURE__ */ new Set();
  wss.on("connection", (ws) => {
    wsClients.add(ws);
    console.log(MARK_CHECK, "Websocket client connected");
    ws.on("close", () => wsClients.delete(ws));
  });
  let resolvedConfigPath;
  try {
    resolvedConfigPath = await resolveConfigPath(options);
  } catch (e) {
    if (e instanceof ConfigInspectorError) {
      e.prettyPrint();
      process.exit(1);
    } else {
      throw e;
    }
  }
  const { basePath } = resolvedConfigPath;
  const watcher = chokidar.watch([], {
    ignoreInitial: true,
    cwd: basePath
  });
  watcher.on("change", (path) => {
    payload = void 0;
    console.log();
    console.log(MARK_CHECK, "Config change detected", path);
    wsClients.forEach((ws) => {
      ws.send(JSON.stringify({
        type: "config-change",
        path
      }));
    });
  });
  async function getData() {
    try {
      if (!payload) {
        return await readConfig(options).then((res) => {
          const _payload = payload = res.payload;
          _payload.meta.wsPort = port;
          watcher.add(res.dependencies);
          return payload;
        });
      }
      return payload;
    } catch (e) {
      console.error(readErrorWarning);
      if (e instanceof ConfigInspectorError) {
        e.prettyPrint();
      } else {
        console.error(e);
      }
      return {
        message: readErrorWarning,
        error: String(e)
      };
    }
  }
  return {
    port,
    wss,
    watcher,
    getData
  };
}

async function createHostServer(options) {
  const app = createApp();
  const ws = await createWsServer(options);
  const fileMap = /* @__PURE__ */ new Map();
  const readCachedFile = (id) => {
    if (!fileMap.has(id))
      fileMap.set(id, readFile(id, "utf-8").catch(() => void 0));
    return fileMap.get(id);
  };
  app.use("/api/payload.json", eventHandler(async (event) => {
    event.node.res.setHeader("Content-Type", "application/json");
    return event.node.res.end(JSON.stringify(await ws.getData()));
  }));
  app.use("/", eventHandler(async (event) => {
    const result = await serveStatic(event, {
      fallthrough: true,
      getContents: (id) => readCachedFile(join(distDir, id)),
      getMeta: async (id) => {
        const stats = await stat(join(distDir, id)).catch(() => {
        });
        if (!stats || !stats.isFile())
          return;
        return {
          type: lookup(id),
          size: stats.size,
          mtime: stats.mtimeMs
        };
      }
    });
    if (result === false)
      return readCachedFile(join(distDir, "index.html"));
  }));
  return createServer(toNodeListener(app));
}

const cli = cac(
  "eslint-config-inspector"
);
cli.command("build", "Build inspector with current config file for static hosting").option("--config <configFile>", "Config file path").option("--files", "Include matched file paths in payload", { default: true }).option("--basePath <basePath>", "Base directory for globs to resolve. Default to directory of config file if not provided").option("--base <baseURL>", "Base URL for deployment", { default: "/" }).option("--outDir <dir>", "Output directory", { default: ".eslint-config-inspector" }).action(async (options) => {
  console.log(MARK_INFO, "Building static ESLint config inspector...");
  if (process.env.ESLINT_CONFIG)
    options.config || (options.config = process.env.ESLINT_CONFIG);
  const cwd = process.cwd();
  const outDir = resolve$1(cwd, options.outDir);
  let configs;
  try {
    configs = await readConfig({
      cwd,
      userConfigPath: options.config,
      userBasePath: options.basePath,
      globMatchedFiles: options.files
    });
  } catch (error) {
    if (error instanceof ConfigInspectorError) {
      error.prettyPrint();
      process.exit(1);
    }
    throw error;
  }
  let baseURL = options.base;
  if (!baseURL.endsWith("/"))
    baseURL += "/";
  if (!baseURL.startsWith("/"))
    baseURL = `/${baseURL}`;
  baseURL = baseURL.replace(/\/+/g, "/");
  if (existsSync(outDir))
    await fs.rm(outDir, { recursive: true });
  await fs.mkdir(outDir, { recursive: true });
  await fs.cp(distDir, outDir, { recursive: true });
  const htmlFiles = await fg("**/*.html", { cwd: distDir, onlyFiles: true });
  if (baseURL !== "/") {
    for (const file of htmlFiles) {
      const content = await fs.readFile(resolve$1(distDir, file), "utf-8");
      const newContent = content.replaceAll(/\s(href|src)="\//g, ` $1="${baseURL}`).replaceAll('baseURL:"/"', `baseURL:"${baseURL}"`);
      await fs.writeFile(resolve$1(outDir, file), newContent, "utf-8");
    }
  }
  await fs.mkdir(resolve$1(outDir, "api"), { recursive: true });
  configs.payload.meta.configPath = "";
  configs.payload.meta.basePath = "";
  await fs.writeFile(resolve$1(outDir, "api/payload.json"), JSON.stringify(configs.payload, null, 2), "utf-8");
  console.log(MARK_CHECK, `Built to ${relative(cwd, outDir)}`);
  console.log(MARK_INFO, `You can use static server like \`npx serve ${relative(cwd, outDir)}\` to serve the inspector`);
});
cli.command("", "Start dev inspector").option("--config <configFile>", "Config file path").option("--files", "Include matched file paths in payload", { default: true }).option("--basePath <basePath>", "Base directory for globs to resolve. Default to directory of config file if not provided").option("--host <host>", "Host", { default: process.env.HOST || "127.0.0.1" }).option("--port <port>", "Port", { default: process.env.PORT || 7777 }).option("--open", "Open browser", { default: true }).action(async (options) => {
  const host = options.host;
  const port = await getPort({ port: options.port, portRange: [7777, 9e3], host });
  if (process.env.ESLINT_CONFIG)
    options.config || (options.config = process.env.ESLINT_CONFIG);
  console.log(MARK_INFO, `Starting ESLint config inspector at`, c.green(`http://${host === "127.0.0.1" ? "localhost" : host}:${port}`), "\n");
  const cwd = process.cwd();
  const server = await createHostServer({
    cwd,
    userConfigPath: options.config,
    userBasePath: options.basePath,
    globMatchedFiles: options.files
  });
  server.listen(port, host, async () => {
    if (options.open)
      await open(`http://${host === "127.0.0.1" ? "localhost" : host}:${port}`);
  });
});
cli.help();
cli.parse();
