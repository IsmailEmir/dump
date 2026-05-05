import React from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'

export default function TeamMembersModal({ isOpen, onClose, members, allUsers, onAddMember, leaderId, onLeaveTeam }) {
    const DEFAULT_AVATAR = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNQoZ_eF4ZVub99aUtKo8WZSBSLWEiyr99UQ&s'

    const enrichedMembers = React.useMemo(() => {
        if (!members || !Array.isArray(members) || members.length === 0) return []

        return members.map((member) => {
            const userId = member.id || member.userId || member.UserId
            const foundUser = allUsers?.find(u => u.id === userId || u.userId === userId)

            // Определяем роль: лидер или участник
            const isLeader = member.id === leaderId || member.userId === leaderId || member.isLeader || member.IsLeader

            return {
                ...member,
                ...foundUser,
                id: userId,
                avatarUrl: member.avatarUrl || member.AvatarUrl || foundUser?.avatarUrl || foundUser?.AvatarUrl,
                userName: member.userName || member.UserName || member.username || foundUser?.userName || foundUser?.username || member.Name,
                roleName: isLeader ? 'Лидер' : 'Участник',
                isLeader: isLeader
            }
        })
    }, [members, allUsers, leaderId])

    const hasMembers = enrichedMembers && enrichedMembers.length > 0

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel team-members-modal" onClick={(e) => e.stopPropagation()}>
                <button className="common-close-btn" onClick={onClose}>
                    <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close" />
                </button>

                <header>Участники команды</header>

                <div className="members-list custom-scrollbar" style={{ marginTop: '20px'}}>
                    {hasMembers ? (
                        enrichedMembers.map((member, index) => {
                            const avatarUrl = member.avatarUrl || DEFAULT_AVATAR
                            const username = member.userName || member.Name || member.name || 'Неизвестный'
                            const role = member.roleName || 'Участник'

                            return (
                                <div key={member.id || index} className="member-card">
                                    <div className="member-avatar">
                                        <img src={avatarUrl} alt={username} onError={(e) => { e.target.src = DEFAULT_AVATAR }} />
                                    </div>

                                    <div className="member-info">
                                        <div className="member-name">{username}</div>
                                        <div className="member-role">{role}</div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="quation-text">Нет участников</div>
                    )}
                </div>

                <div className="modal-buttons" style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                    <button
                        className="btn-cancel"
                        onClick={() => {
                            if (onLeaveTeam) onLeaveTeam()
                        }}
                        style={{
                            width: 'auto',
                            justifyContent: 'center',
                            borderColor: '#B44C43'
                        }}
                    >
                        <span className="btn-text">Покинуть команду</span>
                        <img src="https://img.icons8.com/?size=96&id=5HW1YsFkzHio&format=png" alt="Leave" className="btn-icon" />
                        <div className="btn-bg-slide"></div>
                    </button>
                    <button className="btn-save" onClick={onAddMember} style={{ width: 'auto', flex: 1 }}>
                        <span className="btn-text">+ Добавить участника</span>
                        <img src="https://img.icons8.com/?size=96&id=isUGx8n5CHFi&format=png" alt="Add User" className="btn-icon" />
                        <div className="btn-bg-slide"></div>
                    </button>
                </div>
            </div>
        </div>
    )
}