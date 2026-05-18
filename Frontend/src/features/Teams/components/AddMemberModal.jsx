import React, { useState, useEffect, useRef, useCallback } from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'
import { getUserById } from '../../../services/api'
import { useTranslation } from '../../../i18n/LanguageContext'

export default function AddMemberModal({ isOpen, onClose, onAdd, teamId, existingMemberIds = [], onMemberAdded }) {
    const { t } = useTranslation()
    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [warning, setWarning] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [statusCode, setStatusCode] = useState(null)
    const [needsRefresh, setNeedsRefresh] = useState(false)
    const inputRef = useRef(null)
    const isClosingRef = useRef(false)

    useEffect(() => {
        if (isOpen && inputRef.current) inputRef.current.focus()
        // Сбрасываем флаг закрытия и флаг обновления при открытии окна
        if (isOpen) {
            isClosingRef.current = false
            setNeedsRefresh(false)
        }
    }, [isOpen])

    const handleClose = useCallback(() => {
        if (!isClosingRef.current) {
            isClosingRef.current = true
            // Если было успешное добавление, вызываем onMemberAdded для обновления данных
            if (needsRefresh && onMemberAdded && typeof onMemberAdded === 'function') {
                onMemberAdded()
            }
            onClose()
            // Сбрасываем флаг после закрытия
            setNeedsRefresh(false)
        }
    }, [onClose, onMemberAdded, needsRefresh])

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e?.preventDefault?.()
        setError('')
        setSuccess('')
        setWarning('')
        setStatusCode(null)
        const userId = parseInt(inputValue.trim(), 10)
        if (isNaN(userId)) {
            setError(t('userIdMustBeNumber'))
            setStatusCode('error')
            return
        }
        const existingIds = (existingMemberIds || []).map(id => Number(id))
        if (existingIds.includes(userId)) {
            setWarning(t('userAlreadyInTeam'))
            setStatusCode('warning')
            return
        }
        setIsLoading(true)
        try {
            const user = await getUserById(userId)
            if (!user || !user.id) {
                setError(t('userNotFound'))
                setStatusCode('error')
                setIsLoading(false)
                return
            }
            await onAdd(teamId, user.id)
            setInputValue('')
            setIsLoading(false)
            setSuccess(t('memberAddedSuccess'))
            setStatusCode('success')
            setNeedsRefresh(true)

            // НЕ обновляем данные сразу, чтобы не вызывать перерисовку и мигание
            // Обновление произойдет при закрытии окна
        } catch (err) {
            setIsLoading(false)
            const errorMessage = err?.response?.data || err?.message || ''
            const errorString = String(errorMessage).toLowerCase()
            if (err?.response?.status === 404 || errorString.includes('пользователь не найден')) {
                setError('Пользователь не найден')
                setStatusCode('error')
            } else if (errorString.includes('пользователь уже состоит в команде')) {
                setWarning('Пользователь уже состоит в команде')
                setStatusCode('warning')
            } else if (err?.response?.status === 401) {
                setError('Ошибка авторизации. Попробуйте войти снова.')
                setStatusCode('error')
            } else if (err?.code === 'ERR_NETWORK' || (err?.message || '').includes('Network Error')) {
                setError('Не удалось подключиться к серверу. Проверьте, запущен ли бэкенд.')
                setStatusCode('error')
            } else {
                setError('Не удалось добавить участника: ' + (err?.message || 'Неизвестная ошибка'))
                setStatusCode('error')
            }
        }
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
        setError('')
        setSuccess('')
        setWarning('')
        setStatusCode(null)
    }

    const handleInputFocus = () => {
        if (error || warning) {
            setError('')
            setWarning('')
            setStatusCode(null)
            setInputValue('')
        }
    }

    return (
        <div className="add-member-modal-overlay" onClick={handleClose}>
            <div className="add-member-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <button className="common-close-btn" onClick={handleClose}>
                    <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close" />
                </button>

                <header>{t('addMemberTitle')}</header>

                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        ref={inputRef}
                        type="text"
                        className={`add-member-input ${statusCode === 'error' ? 'input-error' : ''} ${statusCode === 'success' ? 'input-success' : ''} ${statusCode === 'warning' ? 'input-warning' : ''}`}
                        placeholder={t('enterUserId')}
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleSubmit()
                            }
                        }}
                        disabled={isLoading}
                        autoFocus
                    />

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    {warning && (
                        <div className="warning-message">
                            {warning}
                        </div>
                    )}

                    <div className="add-member-buttons">
                        <button
                            className="btn-save"
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            <span className="btn-text">{isLoading ? '...' : t('addUserBtn')}</span>
                            <img src="https://img.icons8.com/?size=96&id=isUGx8n5CHFi&format=png" alt="Add" className="btn-icon" />
                            <div className="btn-bg-slide"></div>
                        </button>

                        <button className="btn-cancel" onClick={handleClose} type="button" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} disabled={isLoading}>
                            <span className="btn-text">{t('cancel')}</span>
                            <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Cancel" className="btn-icon" />
                            <div className="btn-bg-slide"></div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}