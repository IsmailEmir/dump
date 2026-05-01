import React, { useState } from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'

function ChangePasswordModal({ isOpen, onClose }) {
    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (newPass.length < 6) {
            setError('Новый пароль должен быть не менее 6 символов')
            return
        }

        if (newPass !== confirmPass) {
            setError('Новые пароли не совпадают')
            return
        }

        console.log('Смена пароля:', { oldPass, newPass })
        alert('Пароль успешно изменен!')
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '400px' }}>
                
                <div className="modal-header">
                    <header>Смена пароля</header>
                    <button className="common-close-btn" onClick={onClose}>
                        <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close"/>
                    </button>
                </div>

                {error && (
                    <div style={{ color: '#ff5252', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="field-wrapper">
                        <input
                            type="password"
                            className="password-input"
                            placeholder="Введите старый пароль"
                            value={oldPass}
                            onChange={(e) => setOldPass(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field-wrapper">
                        <input
                            type="password"
                            className="password-input"
                            placeholder="Введите новый пароль"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field-wrapper">
                        <input
                            type="password"
                            className="password-input"
                            placeholder="Повторите новый пароль"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            required
                        />
                    </div>

                    <div className="modal-buttons" style={{ marginTop: '10px' }}>
                        <button 
                            type="button" 
                            className="btn-cancel" 
                            onClick={onClose}
                            style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} 
                        >
                            <span className="btn-text">Отмена</span>
                            <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Cancel" className="btn-icon" />
                            <div className="btn-bg-slide"></div>
                        </button>

                        <button 
                            type="submit" 
                            className="btn-save"
                            style={{ borderColor: 'rgb(9, 135, 101)' }}
                        >
                            <span className="btn-text">Сменить</span>
                            <img src="https://img.icons8.com/?size=96&id=UZxwz5MMFO8j&format=png" alt="Check" className="btn-icon" />
                            <div className="btn-bg-slide"></div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePasswordModal