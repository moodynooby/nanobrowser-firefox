// Packages the built extension (dist/) into a timestamped zip/xpi.
// Replaces the former @extension/zipper workspace package (streaming fflate
// zip) with a plain shell-free implementation using the standard `zip` CLI,
// which is available on Linux and macOS build environments.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(import.meta.dirname, '..');
const distDir = path.join(rootDir, 'dist');
const zipDir = path.join(rootDir, 'dist-zip');

if (!fs.existsSync(distDir)) {
  console.error(`dist/ not found at ${distDir}. Run "pnpm build" first.`);
  process.exit(1);
}

fs.mkdirSync(zipDir, { recursive: true });

const YYYYMMDD = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const HHmmss = new Date().toISOString().slice(11, 19).replace(/:/g, '');
const archiveName =
  process.env.__FIREFOX__ === 'true' ? `extension-${YYYYMMDD}-${HHmmss}.xpi` : `extension-${YYYYMMDD}-${HHmmss}.zip`;

const archivePath = path.join(zipDir, archiveName);
if (fs.existsSync(archivePath)) fs.unlinkSync(archivePath);

try {
  execSync(`cd ${distDir} && zip -qr "${archivePath}" .`, { stdio: 'inherit' });
  const sizeMB = (fs.statSync(archivePath).size / 1024 / 1024).toFixed(2);
  console.log(`Zipped package: ${archivePath} (${sizeMB} MB)`);
} catch {
  console.error(
    'zip failed. Make sure the `zip` command is available (install via `sudo apt install zip` or equivalent).',
  );
  process.exit(1);
}
