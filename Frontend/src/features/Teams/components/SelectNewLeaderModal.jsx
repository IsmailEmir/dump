import React from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'

export default function SelectNewLeaderModal({ isOpen, onClose, members, allUsers, leaderId, onSelectLeader }) {
    const DEFAULT_AVATAR = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNQoZ_eF4ZVub99aUtKo8WZSBSLWEiyr99UQ&s'

    const enrichedMembers = React.useMemo(() => {
        if (!members || !Array.isArray(members) || members.length === 0) return []

        return members.map((member) => {
            const userId = member.id || member.userId || member.UserId
            // Исключаем текущего лидера из списка выбора
            if (userId === leaderId) return null

            const foundUser = allUsers?.find(u => u.id === userId || u.userId === userId)

            return {
                ...member,
                ...foundUser,
                id: userId,
                avatarUrl: member.avatarUrl || member.AvatarUrl || foundUser?.avatarUrl || foundUser?.AvatarUrl,
                userName: member.userName || member.UserName || member.username || foundUser?.userName || foundUser?.username || member.Name,
            }
        }).filter(m => m !== null) // Убираем текущего лидера
    }, [members, allUsers, leaderId])

    const hasMembers = enrichedMembers && enrichedMembers.length > 0

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel team-members-modal" onClick={(e) => e.stopPropagation()}>
                <button className="common-close-btn" onClick={onClose}>
                    <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close" />
                </button>

                <header>Выберите лидера</header>

                <div className="members-list custom-scrollbar" style={{ marginTop: '20px'}}>
                    {hasMembers ? (
                        enrichedMembers.map((member, index) => {
                            const avatarUrl = member.avatarUrl || DEFAULT_AVATAR
                            const username = member.userName || member.Name || member.name || 'Неизвестный'

                            return (
                                <div
                                    key={member.id || index}
                                    className="member-card member-card-clickable"
                                    onClick={() => onSelectLeader(member)}
                                >
                                    <div className="member-avatar">
                                        <img src={avatarUrl} alt={username} onError={(e) => { e.target.src = DEFAULT_AVATAR }} />
                                    </div>

                                    <div className="member-info">
                                        <div className="member-name">{username}</div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="quation-text">Нет участников для выбора</div>
                    )}
                </div>
            </div>
        </div>
    )
}