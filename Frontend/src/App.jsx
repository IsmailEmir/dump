import { useState } from 'react'
import Login from './features/Auth/components/Login' 
import MainLayout from './layouts/MainLayout'
import { useNavigate, Route, Routes, Navigate } from 'react-router'
import {useEffect} from 'react'
import { LanguageProvider } from './i18n/LanguageContext'

function LoginPage({ onLogin }) {
    const navigate = useNavigate()

    const handleLogin = () => {
        onLogin()
        navigate('/main', { replace: true })
    }

    return <Login onLogin={handleLogin} />
}

function ProtectedRoute({ isAuthenticated, children }) {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            setIsAuthenticated(true)
        }
    }, [])

    const handleLogin = () => {
        localStorage.setItem('token', 'true')
        setIsAuthenticated(true)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        setIsAuthenticated(false)
    }

    return (
        <LanguageProvider>
            <div className={isAuthenticated ? 'mode-menu' : 'mode-login'}>
                <Routes>
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/main" replace />
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />

                <Route
                    path="/main"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <MainLayout onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={
                        <Navigate
                            to={isAuthenticated ? '/main' : '/login'}
                            replace
                        />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={isAuthenticated ? '/main' : '/login'}
                            replace
                        />
                    }
                />
                </Routes>
            </div>
        </LanguageProvider>
    )
}

export default App