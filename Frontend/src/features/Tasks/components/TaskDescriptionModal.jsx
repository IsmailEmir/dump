import React from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'

export default function TaskDescriptionModal({ task, isOpen, onClose }) {
    if (!isOpen || !task) return null

    const formatDate = (dateString) => {
        if (!dateString) return '—'
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return '—'
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getPriorityText = (priority) => {
        switch (priority) {
            case 'low': return 'Низкая'
            case 'medium': return 'Средняя'
            case 'high': return 'Высокая'
            default: return '—'
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low': return '#38ef7d'
            case 'medium': return '#ffd60a'
            case 'high': return '#ff5252'
            default: return 'rgba(255,255,255,0.3)'
        }
    }

    return (
        <div className="desc-modal-overlay" onClick={onClose}>
            <div className="desc-modal-content glass-panel custom-scrollbar" onClick={(e) => e.stopPropagation()}>

                <button className="common-close-btn" onClick={onClose}>
                    <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close" />
                </button>

                <header className="desc-title">{task.title}</header>

                <div className="task-details-container">
                    <div className="task-description-section">
                        <div className="task-description-content custom-scrollbar">
                            {task.description || 'Нет описания'}
                        </div>
                    </div>

                    <div className="task-info-section">
                        <div className="info-block">
                            <div className="info-block-label">Исполнитель:</div>
                            <div className="info-block-value">Вы</div>
                        </div>

                        <div className="info-block">
                            <div className="info-block-label">Важность:</div>
                            <div className="priority-indicator-wrapper">
                                <div className="priority-dot" style={{ backgroundColor: getPriorityColor(task.priority) }}></div>
                                <span className="priority-text">{getPriorityText(task.priority)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="task-dates-wrapper">
                    <div className="date-info">
                        <span className="date-label">Создано:</span>
                        <span className="date-value">{formatDate(task.createdAt)}</span>
                    </div>
                    <div className="date-info">
                        <span className="date-label">Дедлайн:</span>
                        <span className="date-value">{formatDate(task.deadline)}</span>
                    </div>
                </div>

                <div className="desc-modal-buttons">
                    <button className="btn-cancel" onClick={onClose} style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                        <span className="btn-text">Закрыть</span>
                        <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Check" className="btn-icon" />
                        <div className="btn-bg-slide"></div>
                    </button>
                </div>
            </div>
        </div>
    )
}