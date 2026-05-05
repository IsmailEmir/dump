import React, { useRef, useState } from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'
import { useTranslation } from '../../../i18n/LanguageContext'
import { createTeam, getCurrentUser } from '../../../services/api'

const DEFAULT_AVATAR = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-5irPY5zzxpbRCQhMvD6dI3gv8iSDO2WDxA&s'
const BASE_URL = 'http://localhost:5257'

export default function CreateTeamWindow({ isOpen, onClose, onSave }) {
    const { t } = useTranslation();
    const fileInputRef = useRef(null)
    const [teamName, setTeamName] = useState('')
    const [teamDescription, setTeamDescription] = useState('')
    const [logoFile, setLogoFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [serverError, setServerError] = useState('')

    if (!isOpen) return null

    const handleAvatarClick = () => {
        if (!isUploading && !isProcessing) {
            fileInputRef.current.click()
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Пожалуйста, выберите изображение')
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('Размер изображения не должен превышать 5МБ')
                return
            }

            setIsUploading(true)
            setLogoFile(file)

            const reader = new FileReader()
            reader.onload = (event) => {
                setPreviewUrl(event.target.result)
                setIsUploading(false)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setServerError('')

        if (!teamName.trim()) {
            setServerError('Введите название команды')
            return
        }

        setIsProcessing(true)

        try {
            const currentUser = getCurrentUser()
            console.log('📦 Текущий пользователь:', currentUser)

            if (!currentUser) {
                setServerError('Пользователь не авторизован')
                setIsProcessing(false)
                return
            }

            const userId = currentUser.id || currentUser.userId || currentUser.Id || currentUser.UserId;
            console.log('🔍 Найденный LeaderId:', userId)

            if (!userId) {
                setServerError('Не удалось найти ID пользователя')
                setIsProcessing(false)
                return
            }

            const teamData = {
                LeaderId: parseInt(userId),
                teamId: 0,
                Name: teamName.trim(),
                Description: teamDescription.trim() || '',
                AvatarUrl: previewUrl
            }

            const result = await createTeam(teamData)

            setTeamName('')
            setTeamDescription('')
            setLogoFile(null)
            setPreviewUrl(null)
            setIsProcessing(false)
            onClose()
            onSave()
        } catch (error) {
            console.error('Ошибка при создании команды:', error)
            setServerError(error.response?.data?.message || error.message || 'Не удалось создать команду')
            setIsProcessing(false)
        }
    }

    const avatarSrc = previewUrl || DEFAULT_AVATAR

    return (
        <div className="create-team-modal-overlay" onClick={onClose}>
            <div className="create-team-modal-content" onClick={(e) => e.stopPropagation()}>

                <button className="common-close-btn" onClick={onClose} disabled={isProcessing}>
                    <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close" />
                </button>

                <header>{t('createTeam')}</header>

                {serverError && (
                    <div style={{ color: '#ff5252', textAlign: 'center', marginBottom: '10px', fontSize: '14px' }}>
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="team-avatar-section">
                        <div className="team-avatar-circle" onClick={handleAvatarClick}>
                            {isUploading && (
                                <div className="avatar-loading">
                                    <span className="loading-text">{t('loading')}</span>
                                </div>
                            )}

                            {!isUploading && (
                                <img
                                    src={avatarSrc}
                                    alt="Avatar"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                />
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                                disabled={isUploading || isProcessing}
                            />
                        </div>
                        <p className="avatar-hint">{t('uploadLogo')}</p>
                    </div>

                    <input
                        type="text"
                        className="create-team-input"
                        placeholder={t('teamName')}
                        value={teamName}
                        onChange={(e) => {
                            setTeamName(e.target.value)
                            if (serverError) setServerError('')
                        }}
                        required
                        autoFocus
                        disabled={isProcessing}
                    />

                    <textarea
                        className="create-team-input"
                        placeholder={t('teamDescription') || 'Описание команды'}
                        value={teamDescription}
                        onChange={(e) => setTeamDescription(e.target.value)}
                        disabled={isProcessing}
                        rows="3"
                        style={{ resize: 'vertical', minHeight: '80px' }}
                    />

                    <div className="modal-buttons">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={isProcessing}
                            style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                        >
                            <span className="btn-text">{t('cancel')}</span>
                            <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Cancel" className="btn-icon" />
                            <div className="btn-bg-slide"></div>
                        </button>

                        <button
                            type="submit"
                            className="btn-save"
                            style={{ borderColor: '#098765' }}
                            disabled={isProcessing}
                        >
                            <span className="btn-text">{isProcessing ? t('creatingTeam') : t('create')}</span>
                            <img src="https://img.icons8.com/?size=96&id=Y0LmisQTNVSH&format=png" alt="Check" className="btn-icon" />
                            <div className="btn-bg-slide"></div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}