import { useState, useEffect, useRef } from 'react'
import Login from './features/Auth/components/Login'
import MainLayout from './layouts/MainLayout'
import { useNavigate, Route, Routes, Navigate } from 'react-router'
import { LanguageProvider } from './i18n/LanguageContext'
import Preloader from './components/Preloader/Preloader'
import './styles/animations.css'
import './styles/base.css'
import './styles/common-ui.css'

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
    const [isMainLoading, setIsMainLoading] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const theme = localStorage.getItem('theme')

        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light')
            document.body.setAttribute('data-theme', 'light')
        } else {
            document.documentElement.setAttribute('data-theme', 'dark')
            document.body.setAttribute('data-theme', 'dark')
        }

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

    const handlePreloaderComplete = () => {
        setIsMainLoading(false)
    }

    return (
        <LanguageProvider>
            <Preloader
                isActive={isMainLoading}
                onComplete={handlePreloaderComplete}
            />
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
                                <MainLayoutWrapper onLogout={handleLogout} setLoading={setIsMainLoading} />
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

function MainLayoutWrapper({ onLogout, setLoading }) {
    const hasShownLoader = useRef(false)

    useEffect(() => {
        if (!hasShownLoader.current) {
            setLoading(true)
            hasShownLoader.current = true
        }
    }, [setLoading])

    return <MainLayout onLogout={onLogout} />
}

export default App