import React from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'
import { useTranslation } from '../../../i18n/LanguageContext'

export default function DeleteTaskModal({ task, isOpen, onClose, onConfirm }) {
    const { t } = useTranslation();
    if (!isOpen) return null

    const handleDeleteClick = () => {
        onClose()
        setTimeout(onConfirm, 100)
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel">
                <button className="common-close-btn" onClick={onClose}>
                    <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close" />
                </button>
                <header>{t('deleteTask')}?</header>
                <div className="quation-text">
                    {t('deleteConfirm')}
                </div>

                <div className="modal-buttons">
                    <button className="btn-cancel" onClick={handleDeleteClick}>
                        <span className="btn-text">{t('delete')}</span>
                        <img src="https://img.icons8.com/?size=96&id=CzTISLkmHrKE&format=png" alt="Delete" className="btn-icon" />
                        <div className="btn-bg-slide"></div>
                    </button>

                    <button 
                        className="btn-cancel" 
                        onClick={onClose} 
                        style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} 
                        >
                        <span className="btn-text">{t('cancel')}</span>
                        <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Cancel" className="btn-icon" />
                        <div className="btn-bg-slide"></div>
                    </button>
                </div>
            </div>
        </div>
    )
}