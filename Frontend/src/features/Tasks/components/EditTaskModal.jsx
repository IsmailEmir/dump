import React, { useState, useEffect } from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'
import { useTranslation } from '../../../i18n/LanguageContext'

export default function EditTaskModal({ task, isOpen, onClose, onSave }) {
    const { t } = useTranslation();
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState(null)
    const [deadline, setDeadline] = useState('')

    const [errorTitle, setErrorTitle] = useState('')
    const [errorPriority, setErrorPriority] = useState('')
    const [errorDeadline, setErrorDeadline] = useState('')

    const getLocalDateTimeValue = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return ''
        const pad = (n) => n < 10 ? '0' + n : n
        const year = date.getFullYear()
        const month = pad(date.getMonth() + 1)
        const day = pad(date.getDate())
        const hours = pad(date.getHours())
        const minutes = pad(date.getMinutes())
        return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    useEffect(() => {
        if (task && isOpen) {
            setTitle(task.title)
            setDescription(task.description || '')
            setPriority(task.priority || null)
            const formattedDate = getLocalDateTimeValue(task.deadline)
            setTimeout(() => {
                setDeadline(formattedDate)
            }, 50)
            clearErrors()
        }
    }, [task, isOpen])

    if (!isOpen || !task) return null

    const clearErrors = () => {
        setErrorTitle('')
        setErrorPriority('')
        setErrorDeadline('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        clearErrors()

        let isValid = true

        if (!title.trim()) {
            setErrorTitle('Введите название задачи')
            isValid = false
        }

        if (!priority) {
            setErrorPriority('Выберите важность')
            isValid = false
        }

        if (!deadline) {
            setErrorDeadline('Укажите дедлайн')
            isValid = false
        }

        if (isValid) {
            onSave({
                ...task,
                title,
                description,
                priority,
                deadline,
                createdAt: task.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            onClose()
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>

                <button className="common-close-btn" onClick={onClose}>
                    <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close" />
                </button>

                <header>{t('editTask')}</header>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    <div className="field-wrapper">
                        <input
                            type="text"
                            placeholder={t('taskTitle')}
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                                if (errorTitle) setErrorTitle('')
                            }}
                            className={errorTitle ? 'input-error' : ''}
                            autoFocus
                        />
                        {errorTitle && <span className="error-message">{errorTitle}</span>}
                    </div>

                    <textarea
                        placeholder={t('taskDescription')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="resizable-textarea"
                    />

                    <div className="priority-selector field-wrapper">
                        <label className="field-label">{t('priority')}:</label>
                        <div className="priority-options-row">
                            <button
                                type="button"
                                className={`priority-text-btn low-btn ${priority === 'low' ? 'active' : ''}`}
                                onClick={() => {
                                    setPriority('low')
                                    if (errorPriority) setErrorPriority('')
                                }}
                            >
                                    <span className="btn-text-inner">{t('priorityLow')}</span>
                                <div className="btn-bg-slide low-bg"></div>
                            </button>

                            <button
                                type="button"
                                className={`priority-text-btn medium-btn ${priority === 'medium' ? 'active' : ''}`}
                                onClick={() => {
                                    setPriority('medium')
                                    if (errorPriority) setErrorPriority('')
                                }}
                            >
                                    <span className="btn-text-inner">{t('priorityMedium')}</span>
                                <div className="btn-bg-slide medium-bg"></div>
                            </button>

                            <button
                                type="button"
                                className={`priority-text-btn high-btn ${priority === 'high' ? 'active' : ''}`}
                                onClick={() => {
                                    setPriority('high')
                                    if (errorPriority) setErrorPriority('')
                                }}
                            >
                                    <span className="btn-text-inner">{t('priorityHigh')}</span>
                                <div className="btn-bg-slide high-bg"></div>
                            </button>
                        </div>
                        {errorPriority && <span className="error-message">{errorPriority}</span>}
                    </div>

                    <div className="deadline-selector field-wrapper">
                        <label className="field-label">{t('deadline')}:</label>
                        <input
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => {
                                setDeadline(e.target.value)
                                if (errorDeadline) setErrorDeadline('')
                            }}
                            className={`deadline-input ${errorDeadline ? 'input-error' : ''}`}
                        />
                        {errorDeadline && <span className="error-message">{errorDeadline}</span>}
                    </div>

                    <div className="modal-buttons">
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
                            style={{ borderColor: '#098765' }}
                        >
                            <span className="btn-text">{t('save')}</span>
                            <img src="https://img.icons8.com/?size=96&id=TGKHLKPBB4J8&format=png" alt="Check" className="btn-icon" />
                            <div className="btn-bg-slide"></div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}