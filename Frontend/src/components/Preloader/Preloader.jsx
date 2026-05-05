import React, { useEffect, useState } from 'react'
import './Preloader.css'

function Preloader({ isActive, onComplete }) {
    const [shouldRender, setShouldRender] = useState(false)
    const [isFading, setIsFading] = useState(false)

    useEffect(() => {
        if (isActive) {
            setShouldRender(true)
            setIsFading(false)

            const timer = setTimeout(() => {
                setIsFading(true)
                setTimeout(() => {
                    setShouldRender(false)
                    if (onComplete) onComplete()
                }, 500) // Время совпадает с transition в CSS
            }, 2000) // Показываем 2 секунды

            return () => clearTimeout(timer)
        }
    }, [isActive, onComplete])

    if (!shouldRender) return null

    return (
        <div className={`preload-bg ${isFading ? 'fade-out' : ''}`}>
            <img
                src="https://img.icons8.com/?size=96&id=qnXlC34BHU8M&format=png"
                alt="Loading..."
                className="preload-icon"
            />
        </div>
    )
}

export default Preloader