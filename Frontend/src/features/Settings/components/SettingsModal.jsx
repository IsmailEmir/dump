import React, { useState, useEffect } from 'react';
import '../styles/StyleSettingsWindow.css';
import '../../../styles/common-ui.css'
import { useTranslation } from '../../../i18n/LanguageContext';

function SettingsModal({ isOpen, onClose }) {
    const { t, language, setLanguage } = useTranslation();

    const loadSettings = () => {
        const saved = localStorage.getItem('appSettings');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            darkTheme: true,
            notifications: true,
            animations: true,
            language: 'ru'
        };
    };

    const [settings, setSettings] = useState(loadSettings);

    const applyTheme = (isDark) => {
        const themeValue = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', themeValue);
        document.body.setAttribute('data-theme', themeValue);
        localStorage.setItem('theme', themeValue);
    };

    const applyAnimations = (enabled) => {
        if (!enabled) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
    };

    const applySettingsToDOM = (newSettings) => {
        applyTheme(newSettings.darkTheme);
        applyAnimations(newSettings.animations);

        if (newSettings.language && newSettings.language !== language) {
            setLanguage(newSettings.language);
        }

        localStorage.setItem('appSettings', JSON.stringify(newSettings));
    };

    useEffect(() => {
        applySettingsToDOM(settings);
    }, []);

    const handleToggle = (key) => {
        const newSettings = {
            ...settings,
            [key]: !settings[key]
        };
        setSettings(newSettings);
        applySettingsToDOM(newSettings);
    };

    const handleLanguageChange = (newLang) => {
        const newSettings = {
            ...settings,
            language: newLang
        };
        setSettings(newSettings);
        applySettingsToDOM(newSettings);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel settings-modal" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header">
                    <header>{t('settingsTitle')}</header>
                    <button className="common-close-btn" onClick={onClose}>
                        <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close"/>
                    </button>
                </div>

                <div className="settings-container custom-scrollbar">

                    <div className="settings-section">
                        <h3 className="section-title">{t('appearance')}</h3>

                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">{t('darkTheme')}</p>
                                <p className="setting-desc">{t('darkThemeDesc')}</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.darkTheme}
                                    onChange={() => handleToggle('darkTheme')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">{t('animations')}</p>
                                <p className="setting-desc">{t('animationsDesc')}</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.animations}
                                    onChange={() => handleToggle('animations')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3 className="section-title">{t('notificationsSection')}</h3>

                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">{t('notifications')}</p>
                                <p className="setting-desc">{t('notificationsDesc')}</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={() => handleToggle('notifications')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                    </div>

                    <div className="settings-section">
                        <h3 className="section-title">{t('general')}</h3>

                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">{t('language')}</p>
                                <p className="setting-desc">{t('languageDesc')}</p>
                            </div>
                            <select
                                className="settings-select"
                                value={settings.language || language}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                            >
                                <option value="ru">Русский</option>
                                <option value="en">English</option>
                                <option value="tt">Татарча</option>
                                <option value="tr">Türkçe</option>
                                <option value="tk">Türkmençe</option>
                            </select>
                        </div>
                    </div>

                </div>

                <div className="modal-buttons settings-buttons">
                    <button className="btn-cancel" onClick={onClose}
                    style=
                    {{ borderColor: 'rgba(255, 255, 255, 0.3)' , width: '50%', margin: '0 auto'}}>
                        <span className="btn-text">{t('cancel')}</span>
                        <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Check" className="btn-icon"/>
                        <div className="btn-bg-slide"></div>
                    </button>
                </div>

            </div>
        </div>
    );
}

export default SettingsModal;