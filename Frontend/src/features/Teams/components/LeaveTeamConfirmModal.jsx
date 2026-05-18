import React from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'

function LeaveTeamConfirmModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div 
                className="modal-content glass-panel" 
                onClick={(e) => e.stopPropagation()}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
                
                <div className="modal-header">
                    <header>Подтверждение</header>
                    <button className="common-close-btn" onClick={onCancel}>
                        <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close"/>
                    </button>
                </div>

                <p className="confirm-text">
                    Вы точно хотите покинуть команду?
                </p>

                <div className="modal-buttons">
                    <button 
                        className="btn-cancel btn-no" 
                        onClick={onConfirm}
                    >
                        <span className="btn-text">Да</span>
                        <img src="https://img.icons8.com/?size=96&id=5HW1YsFkzHio&format=png" alt="Yes" className="btn-icon" />
                        <div className="btn-bg-slide"></div>
                    </button>

                    <button 
                        className="btn-save btn-yes"
                        onClick={onCancel}
                    >
                        <span className="btn-text">Нет</span>
                        <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="No" className="btn-icon" />
                        <div className="btn-bg-slide"></div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LeaveTeamConfirmModal