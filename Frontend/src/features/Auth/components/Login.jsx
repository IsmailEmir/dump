import React, { useState } from 'react'
import '../styles.css'
import Register from './Register'
import { loginUser, getUserById } from '../../../services/api'

const Login = ({ onLogin }) => {
    const [showRegister, setShowRegister] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            const response = await loginUser({ email, password })
            
            const data = response.data || response
            const user = data.user || data.data || data
            const userId = user.id || user.userId || data.id || data.userId
            
            if (userId) {
                try {
                    const fullUserData = await getUserById(userId)
                    localStorage.setItem('currentUser', JSON.stringify(fullUserData))
                } catch (err) {
                    console.error('❌ Не удалось загрузить данные пользователя:', err)
                    localStorage.setItem('currentUser', JSON.stringify(user))
                }
            }
            
            onLogin()
        } catch (err) {
            console.error(err)
            const errorMessage = err.response?.data?.message || 'Неверный email или пароль'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    if (showRegister) {
        return <Register onLogin={onLogin} onBack={() => setShowRegister(false)} />
    }

    return (
        <>
            <div className="animated-bg-waves">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
            </div>

            <section>
                <form onSubmit={handleSubmit}>
                    <h1>Sign in</h1>

                    {error && (
                        <div style={{ color: '#ff5252', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <div className="inputbox">
                        <ion-icon name="mail-outline"></ion-icon>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                        <label>Email</label>
                    </div>
                    <div className="inputbox">
                        <ion-icon name="lock-closed-outline"></ion-icon>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <label>Password</label>
                    </div>
                    <div className="forget">
                        <label>
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <a href="#">Forgot password?</a>
                    </div>
                    <button type="submit" disabled={isLoading}>Sign in</button>
                    <div className="divider">
                    </div>
                    <div className="register">
                        <p>
                            Don't have an account?{' '}
                            <a href="#" onClick={(e) => { e.preventDefault(); setShowRegister(true); }}>
                                Register
                            </a>
                        </p>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Login