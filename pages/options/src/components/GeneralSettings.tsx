import { t } from '@extension/i18n';
import { DEFAULT_GENERAL_SETTINGS, type GeneralSettingsConfig, generalSettingsStore } from '@extension/storage';
import { useEffect, useState } from 'react';

export const GeneralSettings = () => {
  const [settings, setSettings] = useState<GeneralSettingsConfig>(DEFAULT_GENERAL_SETTINGS);

  useEffect(() => {
    generalSettingsStore.getSettings().then(setSettings);
  }, []);

  const updateSetting = async <K extends keyof GeneralSettingsConfig>(key: K, value: GeneralSettingsConfig[K]) => {
    setSettings(prevSettings => ({ ...prevSettings, [key]: value }));
    await generalSettingsStore.updateSettings({ [key]: value } as Partial<GeneralSettingsConfig>);
    const latestSettings = await generalSettingsStore.getSettings();
    setSettings(latestSettings);
  };

  return (
    <section className="settings-section">
      <div className="card">
        <h2 className="card-title card-title--left">{t('options_general_header')}</h2>

        <div className="form-section">
          <div className="form-row">
            <div>
              <h3 className="form-label">{t('options_general_maxSteps')}</h3>
              <p className="form-desc">{t('options_general_maxSteps_desc')}</p>
            </div>
            <label htmlFor="maxSteps" className="sr-only">
              {t('options_general_maxSteps')}
            </label>
            <input
              id="maxSteps"
              type="number"
              min={1}
              max={50}
              value={settings.maxSteps}
              onChange={e => updateSetting('maxSteps', Number.parseInt(e.target.value, 10))}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div>
              <h3 className="form-label">{t('options_general_maxActions')}</h3>
              <p className="form-desc">{t('options_general_maxActions_desc')}</p>
            </div>
            <label htmlFor="maxActionsPerStep" className="sr-only">
              {t('options_general_maxActions')}
            </label>
            <input
              id="maxActionsPerStep"
              type="number"
              min={1}
              max={50}
              value={settings.maxActionsPerStep}
              onChange={e => updateSetting('maxActionsPerStep', Number.parseInt(e.target.value, 10))}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div>
              <h3 className="form-label">{t('options_general_maxFailures')}</h3>
              <p className="form-desc">{t('options_general_maxFailures_desc')}</p>
            </div>
            <label htmlFor="maxFailures" className="sr-only">
              {t('options_general_maxFailures')}
            </label>
            <input
              id="maxFailures"
              type="number"
              min={1}
              max={10}
              value={settings.maxFailures}
              onChange={e => updateSetting('maxFailures', Number.parseInt(e.target.value, 10))}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div>
              <h3 className="form-label">{t('options_general_enableVision')}</h3>
              <p className="form-desc">{t('options_general_enableVision_desc')}</p>
            </div>
            <div className="toggle">
              <input
                id="useVision"
                type="checkbox"
                checked={settings.useVision}
                onChange={e => updateSetting('useVision', e.target.checked)}
              />
              <label htmlFor="useVision" className="toggle-track">
                <span className="sr-only">{t('options_general_enableVision')}</span>
                <span className="toggle-thumb" />
              </label>
            </div>
          </div>

          <div className="form-row">
            <div>
              <h3 className="form-label">{t('options_general_displayHighlights')}</h3>
              <p className="form-desc">{t('options_general_displayHighlights_desc')}</p>
            </div>
            <div className="toggle">
              <input
                id="displayHighlights"
                type="checkbox"
                checked={settings.displayHighlights}
                onChange={e => updateSetting('displayHighlights', e.target.checked)}
              />
              <label htmlFor="displayHighlights" className="toggle-track">
                <span className="sr-only">{t('options_general_displayHighlights')}</span>
                <span className="toggle-thumb" />
              </label>
            </div>
          </div>

          <div className="form-row">
            <div>
              <h3 className="form-label">{t('options_general_planningInterval')}</h3>
              <p className="form-desc">{t('options_general_planningInterval_desc')}</p>
            </div>
            <label htmlFor="planningInterval" className="sr-only">
              {t('options_general_planningInterval')}
            </label>
            <input
              id="planningInterval"
              type="number"
              min={1}
              max={20}
              value={settings.planningInterval}
              onChange={e => updateSetting('planningInterval', Number.parseInt(e.target.value, 10))}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div>
              <h3 className="form-label">{t('options_general_minWaitPageLoad')}</h3>
              <p className="form-desc">{t('options_general_minWaitPageLoad_desc')}</p>
            </div>
            <div className="space-x-2">
              <label htmlFor="minWaitPageLoad" className="sr-only">
                {t('options_general_minWaitPageLoad')}
              </label>
              <input
                id="minWaitPageLoad"
                type="number"
                min={250}
                max={5000}
                step={50}
                value={settings.minWaitPageLoad}
                onChange={e => updateSetting('minWaitPageLoad', Number.parseInt(e.target.value, 10))}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <h3 className="form-label">{t('options_general_replayHistoricalTasks')}</h3>
              <p className="form-desc">{t('options_general_replayHistoricalTasks_desc')}</p>
            </div>
            <div className="toggle">
              <input
                id="replayHistoricalTasks"
                type="checkbox"
                checked={settings.replayHistoricalTasks}
                onChange={e => updateSetting('replayHistoricalTasks', e.target.checked)}
              />
              <label htmlFor="replayHistoricalTasks" className="toggle-track">
                <span className="sr-only">{t('options_general_replayHistoricalTasks')}</span>
                <span className="toggle-thumb" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
