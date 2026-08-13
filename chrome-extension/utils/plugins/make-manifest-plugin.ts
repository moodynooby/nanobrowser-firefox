import fs from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import type { PluginOption } from 'vite';

type Manifest = chrome.runtime.ManifestV3;

const rootDir = resolve(__dirname, '..', '..');
const refreshFile = resolve(__dirname, '..', 'refresh.js');
const manifestFile = resolve(rootDir, 'manifest.js');

const COLORS = {
  success: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  reset: '\x1b[0m',
};

/** Print a colored log message to the terminal. */
function colorLog(message: string, type: keyof typeof COLORS) {
  console.log(`${COLORS[type]}${message}${COLORS.reset}`);
}

/** Serialize a manifest object to the JSON string format required by each browser. */
function convertManifestToString(manifest: Manifest, target: 'chrome' | 'firefox'): string {
  if (target === 'firefox') {
    // MV3 Firefox requires `background.scripts` instead of `background.service_worker`.
    // The result intentionally drops the chrome-only `service_worker` key, so we
    // build the output as a plain record rather than fighting the ManifestV3 type.
    const record = manifest as unknown as Record<string, unknown>;
    if (typeof record.background === 'object' && record.background !== null) {
      const bg = record.background as Record<string, unknown>;
      if (typeof bg.service_worker === 'string') {
        record.background = {
          type: bg.type ?? 'module',
          scripts: [bg.service_worker],
        };
      }
    }
    return JSON.stringify(record, null, 2);
  }
  return JSON.stringify(manifest, null, 2);
}

const getManifestWithCacheBurst = (): Promise<{ default: chrome.runtime.ManifestV3 }> => {
  const withCacheBurst = (path: string) => `${path}?${Date.now().toString()}`;
  /**
   * In Windows, import() doesn't work without file:// protocol.
   * So, we need to convert path to file:// protocol. (url.pathToFileURL)
   */
  if (process.platform === 'win32') {
    return import(withCacheBurst(pathToFileURL(manifestFile).href));
  }

  return import(withCacheBurst(manifestFile));
};

export default function makeManifestPlugin(config: { outDir: string }): PluginOption {
  function makeManifest(manifest: chrome.runtime.ManifestV3, to: string) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }
    const manifestPath = resolve(to, 'manifest.json');

    const isFirefox = process.env.__FIREFOX__ === 'true';
    const isDev = process.env.__DEV__ === 'true';

    if (isDev) {
      addRefreshContentScript(manifest);
    }

    fs.writeFileSync(manifestPath, convertManifestToString(manifest, isFirefox ? 'firefox' : 'chrome'));
    if (isDev) {
      fs.copyFileSync(refreshFile, resolve(to, 'refresh.js'));
    }

    colorLog(`Manifest file copy complete: ${manifestPath}`, 'success');
  }

  return {
    name: 'make-manifest',
    buildStart() {
      this.addWatchFile(manifestFile);
    },
    async writeBundle() {
      const outDir = config.outDir;
      const manifest = await getManifestWithCacheBurst();
      makeManifest(manifest.default, outDir);
    },
  };
}

function addRefreshContentScript(manifest: Manifest) {
  manifest.content_scripts = manifest.content_scripts || [];
  manifest.content_scripts.push({
    matches: ['http://*/*', 'https://*/*', '<all_urls>'],
    js: ['refresh.js'], // for public's HMR(refresh) support
  });
}
