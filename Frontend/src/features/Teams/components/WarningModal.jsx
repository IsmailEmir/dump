import React from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'

export default function WarningModal({ isOpen, message, onClose }) {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <header>Внимание</header>
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', margin: '20px 0' }}>
                    {message}
                </p>

                <div className="modal-buttons">
                    <button className="btn-save" onClick={onClose}>
                        <span className="btn-text">Ок</span>
                        <img src="https://img.icons8.com/?size=96&id=2WnpVEXfzAbC&format=png" alt="Check" className="btn-icon" />
                        <div className="btn-bg-slide"></div>
                    </button>
                </div>
            </div>
        </div>
    )
}