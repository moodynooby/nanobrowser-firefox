import { useEffect, useState } from 'react';
import '@src/Options.css';
import { t } from '@extension/i18n';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { Button } from '@extension/ui';
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
    <div className="options-page">
      <header className="options-header">
        <h1>{t('options_nav_header')}</h1>
        <div className="options-tabs">
          {TABS.map(item => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`options-tab ${activeTab === item.id ? 'options-tab--active' : ''}`}
            >
              <item.icon />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="options-content">
        <div className="options-content-inner">{renderTabContent()}</div>
      </main>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Loading...</div>), <div>Error Occurred</div>);
