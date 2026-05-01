import React, { useState } from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'
import TeamTasksWindow from './TeamTasksWindow'
import AddMemberModal from './AddMemberModal'

export default function TeamProfile({ teamData, onClose }) {
    const [isTasksOpen, setIsTasksOpen] = useState(false)
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)

    if (!teamData) return null

    if (isTasksOpen) {
        return (
            <TeamTasksWindow
                teamData={teamData}
                onClose={() => setIsTasksOpen(false)}
            />
        )
    }

    const handleAddMember = () => {
        setIsAddMemberOpen(true)
    }

    const handleMemberAdded = (memberName) => {
        alert(`Участник "${memberName}" добавлен! (заглушка)`)
    }

    return (
        <div className="team-profile-overlay">
            <div className="team-profile-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <button className="common-close-btn" onClick={onClose}>
                    <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close" />
                </button>

                <div className="team-header-info">
                    <div className="team-logo-container">
                        <img src={teamData.logo} alt="Logo" className="team-logo-img" />
                    </div>
                    <header className="team-name-title">{teamData.name}</header>
                </div>

                <div className="team-stats-placeholder">
                    <p>Участников: 1</p>
                    <p>Задач выполнено: 0</p>
                </div>

                <div className="profile-actions-container">
                    <button className="btn-add-member" onClick={handleAddMember}>
                        <span className="btn-text">+ Участник</span>
                        <img src="https://img.icons8.com/?size=96&id=isUGx8n5CHFi&format=png" alt="Add User" className="btn-icon" />
                        <div className="btn-bg-slide secondary-bg"></div>
                    </button>

                    <button className="btn-team-tasks" onClick={() => setIsTasksOpen(true)}>
                        <span className="btn-text">Задачи</span>
                        <img src="https://img.icons8.com/?size=96&id=xJ3hLmeSmDWo&format=png" alt="Tasks" className="btn-icon" />
                        <div className="btn-bg-slide secondary-bg"></div>
                    </button>
                </div>
            </div>

            <AddMemberModal
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                onAdd={handleMemberAdded}
            />
        </div>
    )
}