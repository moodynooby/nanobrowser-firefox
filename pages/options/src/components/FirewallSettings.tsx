import { t } from '@extension/i18n';
import { firewallStore } from '@extension/storage';
import { Button } from '@extension/ui';
import { useCallback, useEffect, useState } from 'react';

export const FirewallSettings = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [allowList, setAllowList] = useState<string[]>([]);
  const [denyList, setDenyList] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [activeList, setActiveList] = useState<'allow' | 'deny'>('allow');

  const loadFirewallSettings = useCallback(async () => {
    const settings = await firewallStore.getFirewall();
    setIsEnabled(settings.enabled);
    setAllowList(settings.allowList);
    setDenyList(settings.denyList);
  }, []);

  useEffect(() => {
    loadFirewallSettings();
  }, [loadFirewallSettings]);

  const handleToggleFirewall = async () => {
    await firewallStore.updateFirewall({ enabled: !isEnabled });
    await loadFirewallSettings();
  };

  const handleAddUrl = async () => {
    const cleanUrl = newUrl.trim().replace(/^https?:\/\//, '');
    if (!cleanUrl) return;

    if (activeList === 'allow') {
      await firewallStore.addToAllowList(cleanUrl);
    } else {
      await firewallStore.addToDenyList(cleanUrl);
    }
    await loadFirewallSettings();
    setNewUrl('');
  };

  const handleRemoveUrl = async (url: string, listType: 'allow' | 'deny') => {
    if (listType === 'allow') {
      await firewallStore.removeFromAllowList(url);
    } else {
      await firewallStore.removeFromDenyList(url);
    }
    await loadFirewallSettings();
  };

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-rose-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-left shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">{t('options_firewall_header')}</h2>

        <div className="space-y-6">
          <div className="my-6 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-700 p-4">
            <div className="flex items-center justify-between">
              <label htmlFor="toggle-firewall" className="text-base font-medium text-gray-700 dark:text-gray-200">
                {t('options_firewall_enableToggle')}
              </label>
              <div className="relative inline-block w-12 select-none">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={handleToggleFirewall}
                  className="sr-only"
                  id="toggle-firewall"
                />
                <label
                  htmlFor="toggle-firewall"
                  className={`block h-6 cursor-pointer overflow-hidden rounded-full ${
                    isEnabled ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span className="sr-only">{t('options_firewall_toggleFirewall_a11y')}</span>
                  <span
                    className={`block size-6 rounded-full bg-white shadow transition-transform ${
                      isEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6 mt-10 flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                onClick={() => setActiveList('allow')}
                className={`px-4 py-2 text-base ${
                  activeList === 'allow'
                    ? 'bg-accent text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                {t('options_firewall_allowList_header')}
              </Button>
              <Button
                onClick={() => setActiveList('deny')}
                className={`px-4 py-2 text-base ${
                  activeList === 'deny'
                    ? 'bg-accent text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                {t('options_firewall_denyList_header')}
              </Button>
            </div>
          </div>

          <div className="mb-4 flex space-x-2">
            <input
              id="url-input"
              type="text"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleAddUrl();
                }
              }}
              placeholder={t('options_firewall_placeholders_domainUrl')}
              className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-white px-3 py-2 text-sm"
            />
            <Button
              onClick={handleAddUrl}
              className="px-4 py-2 text-sm bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
            >
              {t('options_firewall_btnAdd')}
            </Button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {activeList === 'allow' ? (
              allowList.length > 0 ? (
                <ul className="space-y-2">
                  {allowList.map(url => (
                    <li
                      key={url}
                      className="flex items-center justify-between rounded-md p-2 pr-0 bg-gray-100 dark:bg-slate-700"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-200">{url}</span>
                      <Button
                        onClick={() => handleRemoveUrl(url, 'allow')}
                        className="rounded-l-none px-2 py-1 text-xs bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                      >
                        {t('options_firewall_btnRemove')}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {t('options_firewall_allowList_empty')}
                </p>
              )
            ) : denyList.length > 0 ? (
              <ul className="space-y-2">
                {denyList.map(url => (
                  <li
                    key={url}
                    className="flex items-center justify-between rounded-md p-2 pr-0 bg-gray-100 dark:bg-slate-700"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-200">{url}</span>
                    <Button
                      onClick={() => handleRemoveUrl(url, 'deny')}
                      className="rounded-l-none px-2 py-1 text-xs bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {t('options_firewall_denyList_empty')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-rose-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-left shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
          {t('options_firewall_howItWorks_header')}
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-left text-sm text-gray-600 dark:text-gray-300">
          {t('options_firewall_howItWorks')
            .split('\n')
            .map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
        </ul>
      </div>
    </section>
  );
};
