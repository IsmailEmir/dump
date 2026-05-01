import React, { useState } from 'react';
import '../styles/StyleSettingsWindow.css';
import '../../../styles/common-ui.css'
import { useTranslation } from '../../../i18n/LanguageContext';

function SettingsModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    // Загружаем сохраненные настройки при открытии
    const loadSettings = () => {
        const saved = localStorage.getItem('appSettings');
        if (saved) {
            return JSON.parse(saved);
        }
        // Значения по умолчанию
        return {
            darkTheme: true,
            notifications: true,
            animations: true,
            language: 'ru'
        };
    };

    const [settings, setSettings] = useState(loadSettings);

    // Применяем настройки глобально
    const applySettings = (newSettings) => {
    // Смена темы
    document.documentElement.setAttribute('data-theme', newSettings.darkTheme ? 'dark' : 'light');
    document.body.setAttribute('data-theme', newSettings.darkTheme ? 'dark' : 'light');
        
        // Смена языка
        document.documentElement.lang = newSettings.language;

        // Анимации
        if (!newSettings.animations) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }

        // Сохраняем в localStorage
        localStorage.setItem('appSettings', JSON.stringify(newSettings));
    };

    // Применяем настройки при первом рендере
    React.useEffect(() => {
        applySettings(settings);
    }, []);

    const handleToggle = (key) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = () => {
        applySettings(settings);
        window.dispatchEvent(new Event('languageChanged'));
        onClose();
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

                    {/* Секция Уведомления */}
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

                    {/* Секция Общие */}
                    <div className="settings-section">
                        <h3 className="section-title">{t('general')}</h3>

                        <div className="setting-item">
                            <div className="setting-info">
                                <p className="setting-label">{t('language')}</p>
                                <p className="setting-desc">{t('languageDesc')}</p>
                            </div>
                            <select 
                                className="settings-select" 
                                value={settings.language} 
                                onChange={(e) => {
                                    setSettings(prev => ({
                                        ...prev,
                                        language: e.target.value
                                    }));
                                }}
                            >
                                <option value="ru">Русский</option>
                                <option value="en">English</option>
                                <option value="tt">Татарча</option>
                                <option value="tr">Türkçe</option>
                            </select>
                        </div>
                    </div>

                </div>

                <div className="modal-buttons settings-buttons">
                    <button className="btn-cancel" onClick={onClose}>
                        <span className="btn-text">{t('cancel')}</span>
                        <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Check" className="btn-icon"/>
                        <div className="btn-bg-slide"></div>
                    </button>
                    <button className="btn-save" onClick={handleSave}>
                        <span className="btn-text">{t('saveSettings')}</span>
                        <img src="https://img.icons8.com/?size=96&id=2WnpVEXfzAbC&format=png" alt="Check" className="btn-icon"/>
                        <div className="btn-bg-slide"></div>
                    </button>
                </div>

            </div>
        </div>
    );
}

export default SettingsModal;