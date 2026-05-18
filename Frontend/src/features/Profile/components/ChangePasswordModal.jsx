import React, { useState } from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'
import { useTranslation } from '../../../i18n/LanguageContext'

function ChangePasswordModal({ isOpen, onClose }) {
    const { t } = useTranslation()
    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (newPass.length < 6) {
            setError(t('newPasswordMinLength'))
            return
        }

        if (newPass !== confirmPass) {
            setError(t('newPasswordsDoNotMatch'))
            return
        }

        console.log('Смена пароля:', { oldPass, newPass })
        alert(t('passwordChanged'))
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '400px' }}>

                <div className="modal-header">
                    <header>{t('changePasswordTitle')}</header>
                    <button className="common-close-btn" onClick={onClose}>
                        <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close"/>
                    </button>
                </div>

                {error && (
                    <div style={{ color: '#ff5252', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="field-wrapper">
                        <input
                            type="password"
                            className="password-input"
                            placeholder={t('enterOldPassword')}
                            value={oldPass}
                            onChange={(e) => setOldPass(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field-wrapper">
                        <input
                            type="password"
                            className="password-input"
                            placeholder={t('enterNewPassword')}
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field-wrapper">
                        <input
                            type="password"
                            className="password-input"
                            placeholder={t('repeatNewPassword')}
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            required
                        />
                    </div>

                    <div className="modal-buttons" style={{ marginTop: '10px' }}>
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                        >
                            <span className="btn-text">{t('cancel')}</span>
                            <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Cancel" className="btn-icon" />
                            <div className="btn-bg-slide"></div>
                        </button>

                        <button
                            type="submit"
                            className="btn-save"
                            style={{ borderColor: 'rgb(9, 135, 101)' }}
                        >
                            <span className="btn-text">{t('changePasswordBtn')}</span>
                            <img src="https://img.icons8.com/?size=96&id=UZxwz5MMFO8j&format=png" alt="Check" className="btn-icon" />
                            <div className="btn-bg-slide"></div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePasswordModal