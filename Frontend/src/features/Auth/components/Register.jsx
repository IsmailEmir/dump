import React, { useState } from 'react'
import '../styles.css'
import { registerUser } from '../../../services/api'

const Register = ({ onLogin, onBack }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password.length < 6) {
            setError('Кол-во символов не меньше 6')
            return
        }

        if (password !== passwordConfirm) {
            setError('Пароли не совпадают!')
            return
        }

        setIsLoading(true) 
        try {
            await registerUser({
                username,
                email,
                password,
                roleId: 2,
                teamId: null
            })
            alert('Регистрация успешна! Пожалуйста, войдите.')
            onBack()
        } catch (err) {
            console.error(err)
            const errorMessage = err.response?.data?.message || 'Ошибка при регистрации. Попробуйте позже.'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
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
                    <h1>Sign up</h1>
                    {error && (
                        <div style={{ color: '#ff5252', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}
                    <div className="inputbox">
                        <ion-icon name="person-outline"></ion-icon>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                        />
                        <label>Username</label>
                    </div>
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
                    <div className="inputbox">
                        <ion-icon name="lock-closed-outline"></ion-icon>
                        <input
                            type="password"
                            required
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            disabled={isLoading}
                        />
                        <label>Repeat password</label>
                    </div>

                    <button type="submit" disabled={isLoading}>Sign up</button>
                    <div className="divider">
                    </div>
                    <div className="authorization">
                        <p>
                            Already have an account?{' '}
                            <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>
                                Sign in
                            </a>
                        </p>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Register