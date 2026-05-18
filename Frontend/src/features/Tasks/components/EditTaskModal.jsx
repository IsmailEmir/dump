import React, { useEffect, useRef, useState } from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'
import { useTranslation } from '../../../i18n/LanguageContext'
import DateTimePicker from './DateTimePicker'

export default function EditTaskModal({ task, isOpen, onClose, onSave }) {
    const { t } = useTranslation();
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState(null)

    // Используем тот же UX/календарь, что и в AddTaskModal
    const [deadlineDate, setDeadlineDate] = useState(null)
    const [deadlineTime, setDeadlineTime] = useState('12:00')
    const [inputValue, setInputValue] = useState('')
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const calendarRef = useRef(null)

    const [errorTitle, setErrorTitle] = useState('')
    const [errorPriority, setErrorPriority] = useState('')
    const [errorDeadline, setErrorDeadline] = useState('')

    const [titleShake, setTitleShake] = useState(false)
    const [descriptionShake, setDescriptionShake] = useState(false)

    const titleCounterRef = useRef(null)
    const descriptionCounterRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsCalendarOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    useEffect(() => {
        if (deadlineDate) {
            const day = String(deadlineDate.getDate()).padStart(2, '0')
            const month = String(deadlineDate.getMonth() + 1).padStart(2, '0')
            const year = deadlineDate.getFullYear()
            setInputValue(`${day}.${month}.${year} ${deadlineTime}`)
        } else {
            setInputValue('')
        }
    }, [deadlineDate, deadlineTime, isOpen])

    useEffect(() => {
        if (task && isOpen) {
            setTitle(task.title)
            setDescription(task.description || '')
            setPriority(task.priority || null)

            const d = task.deadline ? new Date(task.deadline) : null
            if (d && !isNaN(d.getTime())) {
                setDeadlineDate(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
                const hh = String(d.getHours()).padStart(2, '0')
                const mm = String(d.getMinutes()).padStart(2, '0')
                setDeadlineTime(`${hh}:${mm}`)
            } else {
                setDeadlineDate(null)
                setDeadlineTime('12:00')
            }

            clearErrors()
        }
    }, [task, isOpen])

    if (!isOpen || !task) return null

    const clearErrors = () => {
        setErrorTitle('')
        setErrorPriority('')
        setErrorDeadline('')
    }

    const formatDeadlineInput = (value) => {
        let cleaned = value.replace(/[^\d.\s:]/g, '')
        if (cleaned.length > 16) cleaned = cleaned.slice(0, 16)

        let formatted = ''
        for (let i = 0; i < cleaned.length; i++) {
            const char = cleaned[i]
            formatted += char

            if (i === 1 && /\d/.test(cleaned[i + 1])) formatted += '.'
            else if (i === 4 && /\d/.test(cleaned[i + 1])) formatted += '.'
            else if (i === 9 && /\d/.test(cleaned[i + 1])) formatted += ' '
            else if (i === 12 && /\d/.test(cleaned[i + 1])) formatted += ':'
        }

        return formatted
    }

    const handleDeadlineChange = (e) => {
        const rawValue = e.target.value
        const formattedValue = formatDeadlineInput(rawValue)
        setInputValue(formattedValue)

        const regex = /^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})$/
        const match = formattedValue.match(regex)

        if (match) {
            const [, day, month, year, hours, minutes] = match
            const newDate = new Date(year, month - 1, day)
            if (!isNaN(newDate.getTime()) && newDate.getMonth() === parseInt(month) - 1) {
                setDeadlineDate(newDate)
                setDeadlineTime(`${hours}:${minutes}`)
                if (errorDeadline) setErrorDeadline('')
            } else {
                setDeadlineDate(null)
            }
        } else {
            if (formattedValue === '') setDeadlineDate(null)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        clearErrors()

        let isValid = true

        if (!title.trim()) {
            setErrorTitle('Введите название задачи')
            isValid = false
        }

        if (title.length > 200) {
            setTitleShake(true)
            setTimeout(() => setTitleShake(false), 300)
            isValid = false
        }

        if (description.length > 1000) {
            setDescriptionShake(true)
            setTimeout(() => setDescriptionShake(false), 300)
            isValid = false
        }

        if (!priority) {
            setErrorPriority('Выберите важность')
            isValid = false
        }

        if (!deadlineDate) {
            setErrorDeadline('Укажите дедлайн')
            isValid = false
        }

        if (isValid) {
            const finalDeadline = new Date(deadlineDate)
            if (deadlineTime) {
                const [hours, minutes] = deadlineTime.split(':').map(Number)
                finalDeadline.setHours(hours, minutes, 0, 0)
            }
            const deadlineISO = finalDeadline.toISOString()

            // Определяем statusId на основе текущего статуса задачи
            const statusIdMap = {
                'todo': 1,
                'in-progress': 2,
                'done': 3
            }
            const currentStatus = task.status || task.Status
            const statusId = statusIdMap[currentStatus] || 1

            onSave({
                ...task,
                title,
                description,
                priority,
                deadline: deadlineISO,
                statusId: statusId
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

                    <div className="field-wrapper input-with-counter">
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
                            maxLength={250}
                        />
                        {errorTitle && <span className="error-message">{errorTitle}</span>}
                        <span ref={titleCounterRef} className={`char-counter ${title.length > 200 ? 'char-counter-error' : ''} ${titleShake ? 'shake' : ''}`}>
                            {title.length}/200
                        </span>
                    </div>

                    <div className="field-wrapper custom-scrollbar input-with-counter">
                        <textarea
                            placeholder={t('taskDescription')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="resizable-textarea"
                            maxLength={1050}
                        />
                        <span ref={descriptionCounterRef} className={`char-counter ${description.length > 1000 ? 'char-counter-error' : ''} ${descriptionShake ? 'shake' : ''}`}>
                            {description.length}/1000
                        </span>
                    </div>

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
                        <div ref={calendarRef}>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleDeadlineChange}
                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                className={`deadline-input-trigger ${errorDeadline ? 'input-error' : ''}`}
                                placeholder={t('datePlaceholder')}
                            />

                            {isCalendarOpen && (
                                <div className="custom-calendar-popover">
                                    <DateTimePicker
                                        selectedDate={deadlineDate}
                                        onDateChange={(date) => {
                                            setDeadlineDate(date)
                                            if (errorDeadline) setErrorDeadline('')
                                        }}
                                        selectedTime={deadlineTime}
                                        onTimeChange={setDeadlineTime}
                                    />
                                </div>
                            )}
                        </div>
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