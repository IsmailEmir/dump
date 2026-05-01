import React, { useState, useRef, useEffect } from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'
import { createTask } from '../../../services/api' // <-- Закомментируй импорт, если он больше нигде не нужен в этом файле
import DateTimePicker from './DateTimePicker' 
import { useTranslation } from '../../../i18n/LanguageContext'

export default function AddTaskModal({ isOpen, onClose, onSave, token }) {
    const { t } = useTranslation();
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState(null)
    
    const [deadlineDate, setDeadlineDate] = useState(null) 
    const [deadlineTime, setDeadlineTime] = useState('12:00') 
    
    const [inputValue, setInputValue] = useState('')

    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [errorTitle, setErrorTitle] = useState('')
    const [errorPriority, setErrorPriority] = useState('')
    const [errorDeadline, setErrorDeadline] = useState('')
    const [serverError, setServerError] = useState('')

    const calendarRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return;

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

    const clearErrors = () => {
        setErrorTitle('')
        setErrorPriority('')
        setErrorDeadline('')
        setServerError('')
    }

    const formatDeadlineInput = (value) => {
        let cleaned = value.replace(/[^\d.\s:]/g, '');

        if (cleaned.length > 16) {
            cleaned = cleaned.slice(0, 16);
        }

        let formatted = '';
        for (let i = 0; i < cleaned.length; i++) {
            const char = cleaned[i];
            formatted += char;

            if (i === 1 && /\d/.test(cleaned[i + 1])) {
                formatted += '.';
            }
            else if (i === 4 && /\d/.test(cleaned[i + 1])) {
                formatted += '.';
            }
            else if (i === 9 && /\d/.test(cleaned[i + 1])) {
                formatted += ' ';
            }
            else if (i === 12 && /\d/.test(cleaned[i + 1])) {
                formatted += ':';
            }
        }

        return formatted;
    };


    const handleDeadlineChange = (e) => {
        const rawValue = e.target.value;
        const formattedValue = formatDeadlineInput(rawValue);
        
        setInputValue(formattedValue);

        const regex = /^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})$/;
        const match = formattedValue.match(regex);

        if (match) {
            const [, day, month, year, hours, minutes] = match;
            
            const newDate = new Date(year, month - 1, day);
            
            if (!isNaN(newDate.getTime()) && newDate.getMonth() === parseInt(month) - 1) {
                setDeadlineDate(newDate);
                setDeadlineTime(`${hours}:${minutes}`);
                if (errorDeadline) setErrorDeadline('');
            } else {
                setDeadlineDate(null);
            }
        } else {
            if (formattedValue === '') {
                setDeadlineDate(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        clearErrors()

        let isValid = true

        if (!title.trim()) {
            setErrorTitle(t('errorTitleRequired')) // Используем перевод, если есть, или строку
            isValid = false
        }

        if (!priority) {
            setErrorPriority(t('errorPriorityRequired'))
            isValid = false
        }

        if (!deadlineDate) {
            setErrorDeadline(t('errorDeadlineRequired'))
            isValid = false
        }

        if (!isValid) return

        setIsLoading(true)

        try {
            /* Артём поставил заглушку
            // --- НАЧАЛО ИЗМЕНЕНИЙ: Имитация ответа сервера ---
            
            // 1. Формируем дату для объекта
            let finalDeadline = new Date(deadlineDate)
            if (deadlineTime) {
                const [hours, minutes] = deadlineTime.split(':').map(Number)
                finalDeadline.setHours(hours, minutes, 0, 0)
            }
            const deadlineISO = finalDeadline.toISOString()

            // 2. Создаем фейковый объект задачи, как будто он пришел с бэка
            // Важно: добавь id, если твой список задач требует уникальный ID для рендеринга
            const mockNewTask = {
                id: Date.now(), // Генерируем временный ID
                title: title,
                description: description,
                priority: priority,
                deadline: deadlineISO,
                createdAt: new Date().toISOString()
            };

            // Имитация задержки сети (опционально, для реалистичности)
            await new Promise(resolve => setTimeout(resolve, 500));

            // 3. Передаем этот объект в onSave, чтобы он появился в списке
            onSave(mockNewTask);
            
            // --- КОНЕЦ ИЗМЕНЕНИЙ ---
            */

            
            
            // ------------МЕРДАН добавил запрос к бэку---------- 
            // --- НАЧАЛО ИЗМЕНЕНИЙ: Реальный запрос к бэкенду ---

            // 1. Формируем дату для объекта
            let finalDeadline = new Date(deadlineDate)
            if (deadlineTime) {
                const [hours, minutes] = deadlineTime.split(':').map(Number)
                finalDeadline.setHours(hours, minutes, 0, 0)
            }
            const deadlineISO = finalDeadline.toISOString()

            // 2. Формируем данные для отправки (PascalCase как в C# модели)
            const taskData = {
                Title: title,
                Description: description,
                Priority: priority,
                Deadline: deadlineISO
            };

            console.log('Отправляем на бэкенд:', taskData);

            // 3. Отправляем POST-запрос на бэкенд
            // Важно: createTask() в сервисе уже возвращает response.data
            const createdTask = await createTask(taskData)

            console.log('Ответ от сервера:', createdTask)

            // 4. Передаем объект задачи наверх, чтобы обновить список
            // onSave может быть async (например, чтобы подтянуть свежие данные с бэка)
            await Promise.resolve(onSave(createdTask))

            // --- КОНЕЦ ИЗМЕНЕНИЙ ---

            setTitle('')
            setDescription('')
            setPriority(null)
            setDeadlineDate(null)
            setDeadlineTime('12:00')
            setInputValue('')
            setIsCalendarOpen(false)
            onClose()
        } catch (err) {
            console.error(err)
            const errorMessage = err.response?.data?.message || 'Не удалось создать задачу. Попробуйте позже.'
            setServerError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        isOpen ? (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>

                    <button className="common-close-btn" onClick={onClose} disabled={isLoading}>
                        <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close" />
                    </button>

                    <header>{t('newTask')}</header>

                    {serverError && (
                        <div style={{ color: '#ff5252', textAlign: 'center', marginBottom: '10px', fontSize: '14px' }}>
                            {serverError}
                        </div>
                    )}

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
                                disabled={isLoading}
                                autoFocus
                            />
                            {errorTitle && <span className="error-message">{errorTitle}</span>}
                        </div>

                        <div className="field-wrapper">
                            <textarea
                                placeholder={t('taskDescription')}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="resizable-textarea"
                                disabled={isLoading}
                            />
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
                                    disabled={isLoading}
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
                                    disabled={isLoading}
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
                                    disabled={isLoading}
                                >
                                    <span className="btn-text-inner">{t('priorityHigh')}</span>
                                    <div className="btn-bg-slide high-bg"></div>
                                </button>
                            </div>
                            {errorPriority && <span className="error-message">{errorPriority}</span>}
                        </div>

                        <div className="deadline-selector field-wrapper" ref={calendarRef}>
                            <label className="field-label">{t('deadline')}:</label>
                            
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleDeadlineChange}
                                onClick={() => !isLoading && setIsCalendarOpen(!isCalendarOpen)}
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
                            
                            {errorDeadline && <span className="error-message">{errorDeadline}</span>}
                        </div>

                        <div className="modal-buttons">
                            <button 
                                type="button" 
                                className="btn-cancel" 
                                onClick={onClose}
                                disabled={isLoading}
                                style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} 
                            >
                                <span className="btn-text">{t('cancel')}</span>
                                <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Cancel" className="btn-icon" />
                                <div className="btn-bg-slide"></div>
                            </button>

                            <button 
                                type="submit" 
                                className="btn-save"
                                disabled={isLoading}
                            >
                                <span className="btn-text">{isLoading ? t('saving') : t('save')}</span>
                                <img src="https://img.icons8.com/?size=96&id=GqJpEbXPcmLg&format=png" alt="Check" className="btn-icon" />
                                <div className="btn-bg-slide"></div>
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        ) : null 
    )
}