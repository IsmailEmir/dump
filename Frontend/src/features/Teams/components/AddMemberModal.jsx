import React, { useState } from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'

export default function AddMemberModal({ isOpen, onClose, onAdd }) {
    const [inputValue, setInputValue] = useState('')

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        if (inputValue.trim()) {
            onAdd(inputValue)
            setInputValue('')
            onClose()
        }
    }

    return (
        <div className="add-member-modal-overlay" onClick={onClose}>
            <div className="add-member-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <button className="common-close-btn" onClick={onClose}>
                    <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close" />
                </button>

                <header>Добавить участника</header>
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="add-member-input"
                        placeholder="Введите ID или Имя"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                    />
                    
                    <div className="add-member-buttons">
                        <button className="btn-save">
                            <span className="btn-text">Добавить</span>
                            <img src="https://img.icons8.com/?size=96&id=isUGx8n5CHFi&format=png" alt="Add" className="btn-icon" />
                            <div className="btn-bg-slide"></div>
                        </button>

                        <button className="btn-cancel" onClick={onClose} style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                            <span className="btn-text">Отмена</span>
                            <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Cancel" className="btn-icon" />
                            <div className="btn-bg-slide"></div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}