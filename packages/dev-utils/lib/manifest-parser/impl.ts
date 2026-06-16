import type { Manifest, ManifestParserInterface } from './type';

export const ManifestParserImpl: ManifestParserInterface = {
  convertManifestToString: (manifest, env) => {
    if (env === 'firefox') {
      manifest = convertToFirefoxCompatibleManifest(manifest);
    }
    return JSON.stringify(manifest, null, 2);
  },
};

function convertToFirefoxCompatibleManifest(manifest: Manifest) {
  const manifestCopy = {
    ...manifest,
  } as { [key: string]: unknown };

  manifestCopy.background = {
    scripts: [manifest.background?.service_worker],
    type: 'module',
  };
  manifestCopy.options_ui = {
    page: manifest.options_page,
    browser_style: false,
  };
  manifestCopy.content_security_policy = {
    extension_pages: "script-src 'self'; object-src 'self'",
  };

  // Preserve browser_specific_settings from manifest.js if it exists, otherwise use defaults
  const existingBss = manifest.browser_specific_settings;
  if (existingBss) {
    manifestCopy.browser_specific_settings = existingBss;
  } else {
    manifestCopy.browser_specific_settings = {
      gecko: {
        id: 'manas@manas.com',
        strict_min_version: '109.0',
      },
    };
  }

  delete manifestCopy.options_page;
  return manifestCopy as Manifest;
}
