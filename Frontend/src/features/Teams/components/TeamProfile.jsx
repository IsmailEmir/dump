import React, { useState, useEffect } from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'
import { getTeamById, addUserToTeam, getUsers, removeUserFromTeam, changeTeamLeader, deleteTeam, deleteTeamTasks } from '../../../services/api'
import TeamTasksWindow from './TeamTasksWindow'
import AddMemberModal from './AddMemberModal'
import TeamMembersModal from './TeamMembersModal'
import LeaveTeamConfirmModal from './LeaveTeamConfirmModal'
import DeleteTeamConfirmModal from './DeleteTeamConfirmModal'
import SelectNewLeaderModal from './SelectNewLeaderModal'
import ConfirmLeaderTransferModal from './ConfirmLeaderTransferModal'

export default function TeamProfile({ teamData, onClose, onRefresh }) {
    const [isTasksOpen, setIsTasksOpen] = useState(false)
    const [isMembersOpen, setIsMembersOpen] = useState(false)
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
    const [currentTeamData, setCurrentTeamData] = useState(teamData)
    const [isLoading, setIsLoading] = useState(true)
    const [allUsers, setAllUsers] = useState([])
    const [existingMemberIds, setExistingMemberIds] = useState([])

    // Состояния для модальных окон
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showSelectLeader, setShowSelectLeader] = useState(false)
    const [showConfirmTransfer, setShowConfirmTransfer] = useState(false)
    const [selectedNewLeader, setSelectedNewLeader] = useState(null)

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    const currentUserId = currentUser?.id || currentUser?.userId
    const leaderId = currentTeamData?.leaderId || currentTeamData?.LeaderId
    const isLeader = currentUserId === leaderId

    useEffect(() => {
        if (teamData && teamData.id) {
            loadTeamDetails()
            loadAllUsers()
        } else {
            setCurrentTeamData(teamData)
            setIsLoading(false)
        }
    }, [teamData])

    useEffect(() => {
        const membersList = currentTeamData?.members || []
        const ids = !membersList || !Array.isArray(membersList)
            ? []
            : membersList.map(member => {
                const id = member.id || member.userId || member.UserId
                return id != null ? Number(id) : null
              }).filter(id => id !== null)
        setExistingMemberIds(ids)
    }, [currentTeamData])

    const loadTeamDetails = async () => {
        try {
            setIsLoading(true)
            const details = await getTeamById(teamData.id)
            setCurrentTeamData(details)
        } catch (error) {
            console.error('Ошибка при загрузке деталей команды:', error)
            setCurrentTeamData(teamData)
        } finally {
            setIsLoading(false)
        }
    }

    const loadAllUsers = async () => {
        try {
            const users = await getUsers()
            setAllUsers(users || [])
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error)
            setAllUsers([])
        }
    }

    const handleLeaveTeam = async () => {
        try {
            await removeUserFromTeam(currentTeamData.id, currentUserId)
            onRefresh()
            onClose()
        } catch (error) {
            console.error('Ошибка при выходе из команды:', error)
        }
    }

    const handleDeleteTeam = async () => {
        try {
            await deleteTeamTasks(currentTeamData.id)
            await deleteTeam(currentTeamData.id)
            onRefresh()
            onClose()
        } catch (error) {
            console.error('Ошибка при удалении команды:', error)
        }
    }

    const handleSelectNewLeader = (newLeader) => {
        setSelectedNewLeader(newLeader)
        setShowSelectLeader(false)
        setShowConfirmTransfer(true)
    }

    const handleConfirmLeaderTransfer = async () => {
        if (!selectedNewLeader) return
        try {
            const newLeaderId = selectedNewLeader.id || selectedNewLeader.userId
            await changeTeamLeader(currentTeamData.id, newLeaderId)
            await removeUserFromTeam(currentTeamData.id, currentUserId)
            onRefresh()
            onClose()
            setShowConfirmTransfer(false)
            setSelectedNewLeader(null)
        } catch (error) {
            console.error('Ошибка при передаче лидерства:', error)
        }
    }

    if (!currentTeamData || isLoading) return null

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

    const handleMemberAdded = async (teamId, userId) => {
        try {
            await addUserToTeam(teamId, userId)
            return true
        } catch (error) {
            console.error('Ошибка при добавлении участника:', error)
            throw error
        }
    }

    const handleNewMemberAdded = async () => {
        await loadTeamDetails()
        await loadAllUsers()
        return true
    }

    const membersCount = currentTeamData.members?.length || 1
    const membersList = currentTeamData.members || []

    return (
        <>
            <div className="team-profile-overlay">
                <div className="team-profile-content glass-panel" onClick={(e) => e.stopPropagation()}>
                    <button className="common-close-btn" onClick={onClose}>
                        <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close" />
                    </button>

                    <div className="team-header-info">
                        {/* Иконки короны и мусорки слева от аватарки */}
                        {isLeader && (
                            <div className="leader-icons-container">
                                <button
                                    className="icon-btn-micro"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    title="Удалить команду"
                                    style={{ padding: 0, background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    <img src="https://img.icons8.com/?size=96&id=CzTISLkmHrKE&format=png" alt="Delete Team" style={{ width: '24px', height: '20px'}} />
                                </button>
                            </div>
                        )}
                        <div className="team-logo-container">
                            <img
                                src={currentTeamData.avatarUrl || currentTeamData.AvatarUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-5irPY5zzxpbRCQhMvD6dI3gv8iSDO2WDxA&s'}
                                alt="Logo"
                                className="team-logo-img"
                            />
                        </div>
                        <header className="team-name-title">{currentTeamData.name}</header>
                    </div>

                    {currentTeamData.description && (
                        <div className="team-description-panel custom-scrollbar" style={{
                            backgroundColor: 'rgba(1, 1, 1, 0.1)',
                            borderRadius: '12px',
                            padding: '15px',
                            marginTop: '20px',
                            maxHeight: '150px',
                            overflowY: 'auto'
                        }}>
                            <p style={{
                                margin: 0,
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {currentTeamData.description}
                            </p>
                        </div>
                    )}

                    <div className="profile-actions-container" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button
                            className="btn-cancel"
                            onClick={() => setIsMembersOpen(true)}
                            style={{
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                width: '50%',
                                justifyContent: 'center'
                            }}
                        >
                            <span className="btn-text">Участники: {membersCount}</span>
                            <img src="https://img.icons8.com/?size=96&id=isUGx8n5CHFi&format=png" alt="Users" className="btn-icon"/>
                            <div className="btn-bg-slide"></div>
                        </button>

                        <button className="btn-team-tasks" onClick={() => setIsTasksOpen(true)} style={{width: "50%"}}>
                            <span className="btn-text">Задачи</span>
                            <img src="https://img.icons8.com/?size=96&id=xJ3hLmeSmDWo&format=png" alt="Tasks" className="btn-icon" />
                            <div className="btn-bg-slide secondary-bg"></div>
                        </button>
                    </div>
                </div>

                <TeamMembersModal
                    isOpen={isMembersOpen}
                    onClose={() => setIsMembersOpen(false)}
                    members={membersList}
                    allUsers={allUsers}
                    leaderId={leaderId}
                    onAddMember={() => {
                        setIsMembersOpen(false)
                        setIsAddMemberOpen(true)
                    }}
                    onLeaveTeam={() => {
                        setShowLeaveConfirm(true)
                    }}
                />

                <AddMemberModal
                    isOpen={isAddMemberOpen}
                    onClose={() => setIsAddMemberOpen(false)}
                    onAdd={handleMemberAdded}
                    teamId={currentTeamData.id}
                    existingMemberIds={existingMemberIds}
                    onMemberAdded={handleNewMemberAdded}
                />
            </div>

            {/* Модальные окна подтверждения */}
            <LeaveTeamConfirmModal
                isOpen={showLeaveConfirm}
                onConfirm={() => {
                    if (isLeader) {
                        setShowLeaveConfirm(false)
                        setShowSelectLeader(true)
                    } else {
                        handleLeaveTeam()
                        setShowLeaveConfirm(false)
                    }
                }}
                onCancel={() => setShowLeaveConfirm(false)}
            />

            <DeleteTeamConfirmModal
                isOpen={showDeleteConfirm}
                onConfirm={handleDeleteTeam}
                onCancel={() => setShowDeleteConfirm(false)}
            />

            <SelectNewLeaderModal
                isOpen={showSelectLeader}
                onClose={() => setShowSelectLeader(false)}
                members={membersList}
                leaderId={leaderId}
                onSelectLeader={handleSelectNewLeader}
            />

            <ConfirmLeaderTransferModal
                isOpen={showConfirmTransfer}
                onConfirm={handleConfirmLeaderTransfer}
                onCancel={() => {
                    setShowConfirmTransfer(false)
                    setSelectedNewLeader(null)
                }}
                newLeaderName={selectedNewLeader?.userName || selectedNewLeader?.name || 'Новый лидер'}
            />
        </>
    )
}