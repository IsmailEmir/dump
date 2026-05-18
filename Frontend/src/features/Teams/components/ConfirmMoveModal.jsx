import React from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'

export default function ConfirmMoveModal({ isOpen, message, onConfirm, onCancel }) {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <header>Подтверждение</header>
                <p 
                className="confirm-text">
                    {message}
                </p>

                <div className="modal-buttons">
                    <button className="btn-save" onClick={onConfirm}>
                        <span className="btn-text">Да</span>
                        <img src="https://img.icons8.com/?size=96&id=2WnpVEXfzAbC&format=png" alt="Check" className="btn-icon" />
                        <div className="btn-bg-slide"></div>
                    </button>

                    <button className="btn-cancel" onClick={onCancel}>
                        <span className="btn-text">Нет</span>
                        <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Cancel" className="btn-icon" />
                        <div className="btn-bg-slide"></div>
                    </button>
                </div>
            </div>
        </div>
    )
}