import fs from 'node:fs';
import deepmerge from 'deepmerge';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

const isFirefox = process.env.__FIREFOX__ === 'true';
const isOpera = process.env.__OPERA__ === 'true';

/**
 * Adds Firefox sidebar support using the sidebar_action API.
 * Firefox uses sidebar_action instead of Chrome's sidePanel API.
 */
function withFirefoxSidebar(manifest) {
  if (!isFirefox) {
    return manifest;
  }
  return deepmerge(manifest, {
    sidebar_action: {
      default_panel: 'side-panel/index.html',
      default_title: 'Nanobrowser',
      default_icon: 'icon.svg',
      open_at_install: true,
    },
    // Firefox-specific settings
    browser_specific_settings: {
      gecko: {
        id: 'manas@manas.com',
        strict_min_version: '140.0',
        data_collection_permissions: {
          required: ['browsingActivity', 'websiteContent'],
          optional: ['technicalAndInteraction'],
        },
      },
    },
  });
}

/**
 * Adds Chrome sidePanel support.
 * Chrome uses sidePanel API instead of Firefox's sidebar_action.
 */
function withChromeSidePanel(manifest) {
  if (isFirefox) {
    return manifest;
  }
  return deepmerge(manifest, {
    side_panel: {
      default_path: 'side-panel/index.html',
    },
    permissions: ['sidePanel'],
  });
}

/**
 * Adds Opera sidebar support using the sidebar_action API.
 * This is compatible with Chrome extensions and won't break Chrome Web Store validation.
 */
function withOperaSidebar(manifest) {
  // Only add Opera sidebar_action if building specifically for Opera
  if (isFirefox || !isOpera) {
    return manifest;
  }

  return deepmerge(manifest, {
    sidebar_action: {
      default_panel: 'side-panel/index.html',
      default_title: 'Nanobrowser',
      default_icon: {
        16: 'icon-32.png',
        32: 'icon-32.png',
      },
    },
  });
}

/**
 * Configure permissions based on browser capabilities.
 * Firefox doesn't support the debugger API, so we remove it for Firefox builds.
 */
function withBrowserPermissions(manifest) {
  if (!isFirefox) {
    return manifest;
  }

  // Firefox doesn't support chrome.debugger API
  // Remove debugger and webNavigation permissions for Firefox
  const firefoxManifest = { ...manifest };
  if (firefoxManifest.permissions) {
    firefoxManifest.permissions = firefoxManifest.permissions.filter(
      perm => perm !== 'debugger' && perm !== 'webNavigation',
    );
  }

  return firefoxManifest;
}

/**
 * Adds data collection permissions disclosure.
 * Required by Chrome Web Store for transparency about user data handling.
 */
function withDataCollectionPermissions(manifest) {
  return deepmerge(manifest, {
    data_collection_permissions: {
      // No data collected by the extension itself
      collected_data_categories: [],
      // Extension does not share user data with third parties
      shared_data_categories: [],
    },
  });
}

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = withDataCollectionPermissions(
  withOperaSidebar(
    withChromeSidePanel(
      withFirefoxSidebar(
        withBrowserPermissions({
          manifest_version: 3,
          default_locale: 'en',
          /**
           * if you want to support multiple languages, you can use the following reference
           * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
           */
          name: '__MSG_app_metadata_name__',
          version: packageJson.version,
          description: '__MSG_app_metadata_description__',
          host_permissions: ['<all_urls>'],
          permissions: ['storage', 'scripting', 'tabs', 'activeTab', 'debugger', 'unlimitedStorage', 'webNavigation'],
          options_page: 'options/index.html',
          background: {
            service_worker: 'background.iife.js',
            type: 'module',
          },
          action: {
            default_icon: 'icon-32.png',
          },
          icons: {
            128: 'icon-128.png',
            32: 'icon-32.png',
            16: 'icon-32.png',
          },
          content_scripts: [
            {
              matches: ['http://*/*', 'https://*/*', '<all_urls>'],
              all_frames: true,
              js: ['content/index.iife.js'],
            },
          ],
          web_accessible_resources: [
            {
              resources: [
                '*.js',
                '*.css',
                '*.svg',
                'icon-128.png',
                'icon-32.png',
                'icon.svg',
                'permission/index.html',
                'permission/permission.js',
              ],
              matches: ['*://*/*'],
            },
          ],
        }),
      ),
    ),
  ),
);

export default manifest;
