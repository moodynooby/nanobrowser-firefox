import { t } from '@extension/i18n';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { Button } from '@extension/ui';
import { useEffect, useState } from 'react';
import { FiCpu, FiSettings, FiShield } from 'react-icons/fi';
import { FirewallSettings } from './components/FirewallSettings';
import { GeneralSettings } from './components/GeneralSettings';
import { ModelSettings } from './components/ModelSettings';

type TabTypes = 'general' | 'models' | 'firewall';

const TABS: { id: TabTypes; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { id: 'general', icon: FiSettings, label: t('options_tabs_general') },
  { id: 'models', icon: FiCpu, label: t('options_tabs_models') },
  { id: 'firewall', icon: FiShield, label: t('options_tabs_firewall') },
];

const Options = () => {
  const [activeTab, setActiveTab] = useState<TabTypes>('models');

  const handleTabClick = (tabId: TabTypes) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'models':
        return <ModelSettings />;
      case 'firewall':
        return <FirewallSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen min-w-[768px] flex-col bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-100 sp-gradient">
      <header className="border-b border-white/20 bg-rose-50/10 px-8 pt-6 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
        <h1 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">{t('options_nav_header')}</h1>
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map(item => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex cursor-pointer items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-5 py-2.5 text-[0.9375rem] font-medium text-gray-700 transition-colors duration-150 hover:text-rose-600 ${
                activeTab === item.id ? 'border-rose-600 text-rose-600 dark:border-rose-500 dark:text-rose-500' : ''
              }`}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-white/10 p-8 backdrop-blur-sm dark:bg-transparent">
        <div className="mx-auto min-w-[512px] max-w-[900px]">{renderTabContent()}</div>
      </main>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Loading...</div>), <div>Error Occurred</div>);
