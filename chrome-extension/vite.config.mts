import { resolve } from 'node:path';
import { watchPublicPlugin, watchRebuildPlugin } from '@extension/hmr';
import { isDev, isProduction, watchOption } from '@extension/vite-config';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
import makeManifestPlugin from './utils/plugins/make-manifest-plugin';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

const outDir = resolve(rootDir, '..', 'dist');

export default defineConfig(({ mode }) => {
  // Load environment variables from the parent directory
  const env = loadEnv(mode, resolve(rootDir, '..'), 'VITE_');

  return {
    resolve: {
      alias: {
        '@root': rootDir,
        '@src': srcDir,
        '@assets': resolve(srcDir, 'assets'),
      },
      conditions: ['browser', 'module', 'import', 'default'],
      mainFields: ['browser', 'module', 'main'],
    },
    server: {
      // Restrict CORS to only allow localhost
      cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
      },
      host: 'localhost',
      sourcemapIgnoreList: false,
    },
    plugins: [
      libAssetsPlugin({
        outputPath: outDir,
      }) as PluginOption,
      watchPublicPlugin(),
      makeManifestPlugin({ outDir }),
      isDev && watchRebuildPlugin({ reload: true, id: 'chrome-extension-hmr' }),
    ],
    publicDir: resolve(rootDir, 'public'),
    build: {
      lib: {
        formats: ['iife'],
        entry: resolve(__dirname, 'src/background/index.ts'),
        name: 'BackgroundScript',
        fileName: 'background',
      },
      outDir,
      emptyOutDir: false,
      sourcemap: isDev,
      minify: isProduction,
      reportCompressedSize: isProduction,
      watch: watchOption,
      rollupOptions: {
        external: id => id === 'chrome' || id.startsWith('@anthropic-ai/sdk') || id.startsWith('@puppeteer/browsers'),
      },
    },

    define: {
      'import.meta.env.DEV': isDev,
    },

    envDir: '../',
    envPrefix: 'VITE_',
  };
});
