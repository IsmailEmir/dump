import React, { useRef, useState, useEffect } from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'
import ChangePasswordModal from './ChangePasswordModal'
import LogoutConfirmModal from './LogoutConfirmModal'
import { useTranslation } from '../../../i18n/LanguageContext'
import { getCurrentUser, logoutUser, getUserById } from '../../../services/api'

function ProfileModal({ isOpen, onClose, onLogout }) {
    const { t } = useTranslation();
    const [userData, setUserData] = useState(null);
    const fileInputRef = useRef(null)
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isChangePassOpen, setIsChangePassOpen] = useState(false)
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            const loadUserData = async () => {
                setIsLoading(true);
                try {
                    let user = getCurrentUser();
                    console.log('📦 Данные из localStorage:', user);
                    
                    if (user) {
                        const userId = user.id || user.userId || user.Id || user.UserId;
                        console.log('🔍 Найденный userId:', userId);
                        
                        if (userId) {
                            try {
                                const freshUser = await getUserById(userId);
                                console.log('✅ Данные с сервера:', freshUser);
                                localStorage.setItem('currentUser', JSON.stringify(freshUser));
                                setUserData(freshUser);
                                setAvatarUrl(freshUser.avatarUrl || freshUser.photoUrl || freshUser.imageUrl);
                            } catch (err) {
                                console.warn('⚠️ Ошибка загрузки с сервера:', err);
                                setUserData(user);
                                setAvatarUrl(user.avatarUrl || user.photoUrl || user.imageUrl);
                            }
                        } else {
                            setUserData(user);
                            setAvatarUrl(user.avatarUrl || user.photoUrl || user.imageUrl);
                        }
                    } else {
                        console.log('❌ Данные в localStorage отсутствуют');
                    }
                } catch (err) {
                    console.error('❌ Ошибка при загрузке данных профиля:', err);
                } finally {
                    setIsLoading(false);
                }
            };

            loadUserData();
        }
    }, [isOpen]);

    const handleAvatarClick = () => {
        if (!isUploading) {
            fileInputRef.current.click()
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Пожалуйста выберите изображение')
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Размер изображения не должен превышать 5МБ')
                return
            }
            setIsUploading(true)
            setUploadProgress(0)
            const reader = new FileReader()
            reader.onprogress = (event) => {
                if (event.lengthComputable) {
                    setUploadProgress(Math.round((event.loaded / event.total) * 100))
                }
            }
            reader.onload = (event) => {
                setAvatarUrl(event.target.result)
                setTimeout(() => {
                    setIsUploading(false)
                    setUploadProgress(100)
                }, 800)
            }
            reader.readAsDataURL(file)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '—';
            return date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return '—';
        }
    };

    const maskEmail = (email) => {
        if (!email || typeof email !== 'string' || !email.includes('@')) return '—';
        const [localPart, domain] = email.split('@');
        if (localPart.length <= 3) return email;
        return `${localPart.slice(0, 3)}***@${domain}`;
    };

    const getUserName = () => {
        if (!userData) return 'Пользователь';
        return userData.userName || userData.UserName || userData.username || 'Пользователь';
    };
    
    const getUserId = () => {
        if (!userData) return '—';
        return userData.id || userData.Id || '—';
    };
    
    const getUserEmail = () => {
        if (!userData) return '—';
        const email = userData.email || userData.Email;
        return email ? maskEmail(email) : '—';
    };
    
    const getUserCreatedAt = () => {
        if (!userData) return '—';
        const date = userData.createdAt || userData.CreatedAt;
        return formatDate(date);
    };
    
    const getCompletedTasks = () => {
        if (!userData) return 0;
        return userData.completedTasksCount || userData.CompletedTasksCount || 0;
    };

    const handleLogoutClick = () => {
        setIsLogoutConfirmOpen(true)
    }

    const confirmLogout = () => {
        setIsLogoutConfirmOpen(false)
        onClose()
        onLogout()
    }

    const handleNotLoggedInLogout = async () => {
        await logoutUser();
        onClose();
        if (onLogout) onLogout();
    }

    if (!isOpen) return null

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <header>{t('profileTitle')}</header>
                        <button className="common-close-btn" onClick={onClose}>
                            <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close"/>
                        </button>
                    </div>

                    {isLoading ? (
                        <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Nunito', monospace" }}>
                            <p style={{ fontFamily: "'Nunito', monospace", fontSize: '16px' }}>Загрузка...</p>
                        </div>
                    ) : !userData ? (
                        <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Nunito', monospace" }}>
                            <p style={{ fontFamily: "'Nunito', monospace", fontSize: '16px', marginBottom: '25px' }}>Войдите в систему чтобы увидеть профиль</p>
                            <button 
                                className="btn-cancel" 
                                onClick={handleNotLoggedInLogout}
                                style={{ fontFamily: "'Nunito', monospace", fontSize: '14px' }}
                            >
                                <span className="btn-text">Выйти</span>
                                <img src="https://img.icons8.com/?size=96&id=5HW1YsFkzHio&format=png" alt="Logout" className="btn-icon"/>
                                <div className="btn-bg-slide"></div>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="profile-header">
                                <div className="avatar" onClick={handleAvatarClick}>
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Аватар" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}/>
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', fontSize: '24px' }}>
                                            {getUserName()[0].toUpperCase()}
                                        </div>
                                    )}
                                    {isUploading && (
                                        <div className="avatar-loading">
                                            <div className="upload-progress" style={{width: `${uploadProgress}%`}}></div>
                                            <span className="progress-text">{uploadProgress}%</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        style={{display: 'none'}}
                                        disabled={isUploading}
                                    />
                                </div>
                                <h3 style={{ fontFamily: "'Nunito', monospace" }}>{getUserName()}</h3>
                                <p className="user-id" style={{ fontFamily: "'Nunito', monospace" }}>ID: {getUserId()}</p>
                            </div>

                            <div className="profile-info">
                                <div className="info-card">
                                    <div className="info-icon"><img src="https://img.icons8.com/?size=48&id=ZH1JWehKJFAC&format=png"/></div>
                                    <div className="info-content">
                                        <p className="info-label" style={{ fontFamily: "'Nunito', monospace" }}>{t('registrationDate')}</p>
                                        <p className="info-value" style={{ fontFamily: "'Nunito', monospace" }}>{getUserCreatedAt()}</p>
                                    </div>
                                </div>
                                <div className="info-card">
                                    <div className="info-icon"><img src="https://img.icons8.com/?size=48&id=jTBefpe7oeWd&format=png"/></div>
                                    <div className="info-content">
                                        <p className="info-label" style={{ fontFamily: "'Nunito', monospace" }}>{t('completedTasks')}</p>
                                        <p className="info-value" style={{ fontFamily: "'Nunito', monospace" }}>{getCompletedTasks()}</p>
                                    </div>
                                </div>
                                <div className="info-card full-width">
                                    <div className="info-icon"><img src="https://img.icons8.com/?size=48&id=w5QHcTVpp1In&format=png"/></div>
                                    <div className="info-content">
                                        <p className="info-label" style={{ fontFamily: "'Nunito', monospace" }}>{t('email')}</p>
                                        <p className="info-value" style={{ fontFamily: "'Nunito', monospace" }}>{getUserEmail()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-actions" style={{ display: 'flex', gap: '10px', marginTop: '40px', justifyContent: 'center', width: '100%'}}>
                                <button className="btn-save" onClick={() => setIsChangePassOpen(true)}>
                                    <span className="btn-text">{t('changePassword')}</span>
                                    <img src="https://img.icons8.com/?size=96&id=UZxwz5MMFO8j&format=png" alt="Key" className="btn-icon"/>
                                    <div className="btn-bg-slide"></div>
                                </button>
                                <button className="btn-cancel" onClick={handleLogoutClick}>
                                    <span className="btn-text">{t('logout')}</span>
                                    <img src="https://img.icons8.com/?size=96&id=5HW1YsFkzHio&format=png" alt="Logout" className="btn-icon"/>
                                    <div className="btn-bg-slide"></div>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ChangePasswordModal 
                isOpen={isChangePassOpen} 
                onClose={() => setIsChangePassOpen(false)} 
            />

            <LogoutConfirmModal 
                isOpen={isLogoutConfirmOpen}
                onConfirm={confirmLogout}
                onCancel={() => setIsLogoutConfirmOpen(false)}
            />
        </>
    )
}

export default ProfileModal