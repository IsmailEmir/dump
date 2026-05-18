import React, { useState, useEffect } from 'react'
import './AdminPanel.css'
import '../../styles/common-ui.css'
import { useTranslation } from '../../i18n/LanguageContext'
import {
    getAdminStats,
    getAllUsers, deleteUser, createUser, updateUser, changeUserRole,
    getAllRoles, createRole, updateRole, deleteRole,
    getAllAssignments, createAssignment, updateAssignment, deleteAssignment,
    getAllTeams, createTeam, updateTeam, deleteTeam
} from '../../services/adminApi'

function AdminPanel({ isOpen, onClose }) {
    const { t } = useTranslation()
    const [activeSection, setActiveSection] = useState('dashboard')
    const [stats, setStats] = useState(null)
    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [assignments, setAssignments] = useState([])
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(false)

    // Form states
    const [showUserForm, setShowUserForm] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [userForm, setUserForm] = useState({ username: '', email: '', password: '', roleId: 2 })

    const [showRoleForm, setShowRoleForm] = useState(false)
    const [editingRole, setEditingRole] = useState(null)
    const [roleForm, setRoleForm] = useState({ name: '', description: '' })

    const [showAssignmentForm, setShowAssignmentForm] = useState(false)
    const [editingAssignment, setEditingAssignment] = useState(null)
    const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', priority: 'medium', deadline: '' })

    const [showTeamForm, setShowTeamForm] = useState(false)
    const [editingTeam, setEditingTeam] = useState(null)
    const [teamForm, setTeamForm] = useState({ name: '', description: '' })

    useEffect(() => {
        if (isOpen) {
            loadDashboardData()
        }
    }, [isOpen])

    const loadDashboardData = async () => {
        setLoading(true)
        try {
            const [statsData, usersData, rolesData, assignmentsData, teamsData] = await Promise.all([
                getAdminStats(),
                getAllUsers(),
                getAllRoles(),
                getAllAssignments(),
                getAllTeams()
            ])
            setStats(statsData)
            setUsers(usersData)
            setRoles(rolesData)
            setAssignments(assignmentsData)
            setTeams(teamsData)
        } catch (error) {
            console.error('Ошибка загрузки данных админ-панели:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Вы действительно хотите удалить этого пользователя?')) return
        try {
            await deleteUser(id)
            setUsers(users.filter(u => u.id !== id))
        } catch (error) {
            console.error('Ошибка удаления пользователя:', error)
        }
    }

    const handleSaveUser = async () => {
        try {
            if (editingUser) {
                await updateUser({ ...userForm, id: editingUser.id })
            } else {
                await createUser(userForm)
            }
            setShowUserForm(false)
            setEditingUser(null)
            setUserForm({ username: '', email: '', password: '', roleId: 2 })
            loadDashboardData()
        } catch (error) {
            console.error('Ошибка сохранения пользователя:', error)
        }
    }

    const handleDeleteRole = async (id) => {
        if (!window.confirm('Вы действительно хотите удалить эту роль?')) return
        try {
            await deleteRole(id)
            setRoles(roles.filter(r => r.id !== id))
        } catch (error) {
            console.error('Ошибка удаления роли:', error)
        }
    }

    const handleSaveRole = async () => {
        try {
            if (editingRole) {
                await updateRole({ ...roleForm, id: editingRole.id })
            } else {
                await createRole(roleForm)
            }
            setShowRoleForm(false)
            setEditingRole(null)
            setRoleForm({ name: '', description: '' })
            loadDashboardData()
        } catch (error) {
            console.error('Ошибка сохранения роли:', error)
        }
    }

    const handleDeleteAssignment = async (id) => {
        if (!window.confirm('Вы действительно хотите удалить эту задачу?')) return
        try {
            await deleteAssignment(id)
            setAssignments(assignments.filter(a => a.id !== id))
        } catch (error) {
            console.error('Ошибка удаления задачи:', error)
        }
    }

    const handleSaveAssignment = async () => {
        try {
            if (editingAssignment) {
                await updateAssignment({ ...assignmentForm, id: editingAssignment.id })
            } else {
                await createAssignment(assignmentForm)
            }
            setShowAssignmentForm(false)
            setEditingAssignment(null)
            setAssignmentForm({ title: '', description: '', priority: 'medium', deadline: '' })
            loadDashboardData()
        } catch (error) {
            console.error('Ошибка сохранения задачи:', error)
        }
    }

    const handleDeleteTeam = async (id) => {
        if (!window.confirm('Вы действительно хотите удалить эту команду?')) return
        try {
            await deleteTeam(id)
            setTeams(teams.filter(team => team.id !== id))
        } catch (error) {
            console.error('Ошибка удаления команды:', error)
        }
    }

    const handleSaveTeam = async () => {
        try {
            if (editingTeam) {
                await updateTeam({ ...teamForm, id: editingTeam.id })
            } else {
                await createTeam(teamForm)
            }
            setShowTeamForm(false)
            setEditingTeam(null)
            setTeamForm({ name: '', description: '' })
            loadDashboardData()
        } catch (error) {
            console.error('Ошибка сохранения команды:', error)
        }
    }

    const getStatusBadge = (status) => {
        const statusMap = {
            'todo': 'info',
            'in-progress': 'warning',
            'done': 'success'
        }
        const type = statusMap[status] || 'info'
        return <span className={`admin-badge admin-badge-${type}`}>{status}</span>
    }

    const getPriorityBadge = (priority) => {
        const priorityMap = {
            'low': 'success',
            'medium': 'warning',
            'high': 'danger'
        }
        const type = priorityMap[priority] || 'info'
        return <span className={`admin-badge admin-badge-${type}`}>{priority}</span>
    }

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel admin-panel-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-panel-header">
                    <h2>Админ-панель</h2>
                    <button className="common-close-btn" onClick={onClose}>
                        <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close"/>
                    </button>
                </div>

                <div className="admin-panel-content">
                    <div className="admin-sidebar">
                        <button
                            className={`admin-sidebar-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveSection('dashboard')}
                        >
                            📊 {t('dashboard')}
                        </button>
                        <button
                            className={`admin-sidebar-btn ${activeSection === 'users' ? 'active' : ''}`}
                            onClick={() => setActiveSection('users')}
                        >
                            👥 {t('users')}
                        </button>
                        <button
                            className={`admin-sidebar-btn ${activeSection === 'roles' ? 'active' : ''}`}
                            onClick={() => setActiveSection('roles')}
                        >
                            🏷️ {t('roles')}
                        </button>
                        <button
                            className={`admin-sidebar-btn ${activeSection === 'assignments' ? 'active' : ''}`}
                            onClick={() => setActiveSection('assignments')}
                        >
                            📝 {t('assignments')}
                        </button>
                        <button
                            className={`admin-sidebar-btn ${activeSection === 'teams' ? 'active' : ''}`}
                            onClick={() => setActiveSection('teams')}
                        >
                            🎯 {t('teams')}
                        </button>
                    </div>

                    <div className="admin-main-area custom-scrollbar">
                        {/* Dashboard Section */}
                        <div className={`admin-section ${activeSection === 'dashboard' ? 'active' : ''}`}>
                            {loading ? (
                                <p>{t('loading')}</p>
                            ) : stats ? (
                                <div className="admin-stats-grid">
                                    <div className="admin-stat-card">
                                        <h3>{t('users')}</h3>
                                        <div className="stat-value">{stats.usersCount}</div>
                                    </div>
                                    <div className="admin-stat-card">
                                        <h3>{t('roles')}</h3>
                                        <div className="stat-value">{stats.rolesCount}</div>
                                    </div>
                                    <div className="admin-stat-card">
                                        <h3>{t('assignments')}</h3>
                                        <div className="stat-value">{stats.assignmentsCount}</div>
                                    </div>
                                    <div className="admin-stat-card">
                                        <h3>{t('teams')}</h3>
                                        <div className="stat-value">{stats.teamsCount}</div>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Users Section */}
                        <div className={`admin-section ${activeSection === 'users' ? 'active' : ''}`}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h3>{t('manageUsers')}</h3>
                                <button
                                    className="btn-save"
                                    onClick={() => { setShowUserForm(true); setEditingUser(null); setUserForm({ username: '', email: '', password: '', roleId: 2 }) }}
                                >
                                    <span className="btn-text">{t('add')}</span>
                                    <img src="https://img.icons8.com/?size=96&id=1OvPrBUWbMke&format=png" alt="Add" className="btn-icon"/>
                                    <div className="btn-bg-slide"></div>
                                </button>
                            </div>

                            {showUserForm && (
                                <div className="admin-form">
                                    <h3>{editingUser ? t('editUser') : t('newUser')}</h3>
                                    <div className="admin-form-group">
                                        <label>{t('userName')}</label>
                                        <input
                                            value={userForm.username}
                                            onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={userForm.email}
                                            onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                                        />
                                    </div>
                                    {!editingUser && (
                                        <div className="admin-form-group">
                                            <label>{t('password')}</label>
                                            <input
                                                type="password"
                                                value={userForm.password}
                                                onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                                            />
                                        </div>
                                    )}
                                    <div className="admin-form-group">
                                        <label>{t('roles')}</label>
                                        <select
                                            value={userForm.roleId}
                                            onChange={(e) => setUserForm({...userForm, roleId: parseInt(e.target.value)})}
                                        >
                                            {roles.map(role => (
                                                <option key={role.id} value={role.id}>{role.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="admin-form-buttons">
                                        <button className="btn-cancel" onClick={() => { setShowUserForm(false); setEditingUser(null); }}>
                                            <span className="btn-text">{t('cancel')}</span>
                                            <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Cancel" className="btn-icon"/>
                                            <div className="btn-bg-slide"></div>
                                        </button>
                                        <button className="btn-save" onClick={handleSaveUser}>
                                            <span className="btn-text">{t('save')}</span>
                                            <img src="https://img.icons8.com/?size=96&id=9419591&format=png" alt="Save" className="btn-icon"/>
                                            <div className="btn-bg-slide"></div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>{t('userName')}</th>
                                            <th>Email</th>
                                            <th>{t('roles')}</th>
                                            <th>{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.userName}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <select
                                                        value={user.roleId || 2}
                                                        onChange={(e) => changeUserRole(user.id, parseInt(e.target.value)).then(loadDashboardData)}
                                                        style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontFamily: "'Nunito', monospace", fontSize: '12px' }}
                                                    >
                                                        {roles.map(role => (
                                                            <option key={role.id} value={role.id}>{role.name}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <button
                                                        className="admin-action-btn edit"
                                                        onClick={() => { setEditingUser(user); setUserForm({ username: user.userName, email: user.email, password: '', roleId: user.roleId || 2 }); setShowUserForm(true); }}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="admin-action-btn delete"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Roles Section */}
                        <div className={`admin-section ${activeSection === 'roles' ? 'active' : ''}`}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h3>{t('manageRoles')}</h3>
                                <button
                                    className="btn-save"
                                    onClick={() => { setShowRoleForm(true); setEditingRole(null); setRoleForm({ name: '', description: '' }) }}
                                >
                                    <span className="btn-text">{t('add')}</span>
                                    <img src="https://img.icons8.com/?size=96&id=1OvPrBUWbMke&format=png" alt="Add" className="btn-icon"/>
                                    <div className="btn-bg-slide"></div>
                                </button>
                            </div>

                            {showRoleForm && (
                                <div className="admin-form">
                                    <h3>{editingRole ? t('editRole') : t('newRole')}</h3>
                                    <div className="admin-form-group">
                                        <label>{t('roleName')}</label>
                                        <input
                                            value={roleForm.name}
                                            onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label>{t('roleDescription')}</label>
                                        <textarea
                                            value={roleForm.description}
                                            onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="admin-form-buttons">
                                        <button className="btn-cancel" onClick={() => { setShowRoleForm(false); setEditingRole(null); }}>
                                            <span className="btn-text">{t('cancel')}</span>
                                            <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Cancel" className="btn-icon"/>
                                            <div className="btn-bg-slide"></div>
                                        </button>
                                        <button className="btn-save" onClick={handleSaveRole}>
                                            <span className="btn-text">{t('save')}</span>
                                            <img src="https://img.icons8.com/?size=96&id=9419591&format=png" alt="Save" className="btn-icon"/>
                                            <div className="btn-bg-slide"></div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>{t('roleName')}</th>
                                            <th>{t('roleDescription')}</th>
                                            <th>{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles.map(role => (
                                            <tr key={role.id}>
                                                <td>{role.id}</td>
                                                <td>{role.name}</td>
                                                <td>{role.description || '—'}</td>
                                                <td>
                                                    <button
                                                        className="admin-action-btn edit"
                                                        onClick={() => { setEditingRole(role); setRoleForm({ name: role.name, description: role.description || '' }); setShowRoleForm(true); }}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="admin-action-btn delete"
                                                        onClick={() => handleDeleteRole(role.id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Assignments Section */}
                        <div className={`admin-section ${activeSection === 'assignments' ? 'active' : ''}`}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h3>{t('manageTasks')}</h3>
                                <button
                                    className="btn-save"
                                    onClick={() => { setShowAssignmentForm(true); setEditingAssignment(null); setAssignmentForm({ title: '', description: '', priority: 'medium', deadline: '' }) }}
                                >
                                    <span className="btn-text">{t('add')}</span>
                                    <img src="https://img.icons8.com/?size=96&id=1OvPrBUWbMke&format=png" alt="Add" className="btn-icon"/>
                                    <div className="btn-bg-slide"></div>
                                </button>
                            </div>

                            {showAssignmentForm && (
                                <div className="admin-form">
                                    <h3>{editingAssignment ? t('editTaskAdmin') : t('newTask')}</h3>
                                    <div className="admin-form-group">
                                        <label>{t('taskName')}</label>
                                        <input
                                            value={assignmentForm.title}
                                            onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label>{t('roleDescription')}</label>
                                        <textarea
                                            value={assignmentForm.description}
                                            onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label>{t('priority')}</label>
                                        <select
                                            value={assignmentForm.priority}
                                            onChange={(e) => setAssignmentForm({...assignmentForm, priority: e.target.value})}
                                        >
                                            <option value="low">{t('lowPriority')}</option>
                                            <option value="medium">{t('mediumPriority')}</option>
                                            <option value="high">{t('highPriority')}</option>
                                        </select>
                                    </div>
                                    <div className="admin-form-group">
                                        <label>{t('deadline')}</label>
                                        <input
                                            type="datetime-local"
                                            value={assignmentForm.deadline}
                                            onChange={(e) => setAssignmentForm({...assignmentForm, deadline: e.target.value})}
                                        />
                                    </div>
                                    <div className="admin-form-buttons">
                                        <button className="btn-cancel" onClick={() => { setShowAssignmentForm(false); setEditingAssignment(null); }}>
                                            <span className="btn-text">{t('cancel')}</span>
                                            <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Cancel" className="btn-icon"/>
                                            <div className="btn-bg-slide"></div>
                                        </button>
                                        <button className="btn-save" onClick={handleSaveAssignment}>
                                            <span className="btn-text">{t('save')}</span>
                                            <img src="https://img.icons8.com/?size=96&id=9419591&format=png" alt="Save" className="btn-icon"/>
                                            <div className="btn-bg-slide"></div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>{t('taskName')}</th>
                                            <th>{t('priority')}</th>
                                            <th>{t('status')}</th>
                                            <th>{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignments.map(assignment => (
                                            <tr key={assignment.id}>
                                                <td>{assignment.id}</td>
                                                <td>{assignment.title}</td>
                                                <td>{getPriorityBadge(assignment.priority)}</td>
                                                <td>{getStatusBadge(assignment.status)}</td>
                                                <td>
                                                    <button
                                                        className="admin-action-btn edit"
                                                        onClick={() => { setEditingAssignment(assignment); setAssignmentForm({ title: assignment.title, description: assignment.description, priority: assignment.priority, deadline: assignment.deadline?.slice(0, 16) }); setShowAssignmentForm(true); }}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="admin-action-btn delete"
                                                        onClick={() => handleDeleteAssignment(assignment.id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Teams Section */}
                        <div className={`admin-section ${activeSection === 'teams' ? 'active' : ''}`}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h3>{t('manageTeams')}</h3>
                                <button
                                    className="btn-save"
                                    onClick={() => { setShowTeamForm(true); setEditingTeam(null); setTeamForm({ name: '', description: '' }) }}
                                >
                                    <span className="btn-text">{t('add')}</span>
                                    <img src="https://img.icons8.com/?size=96&id=1OvPrBUWbMke&format=png" alt="Add" className="btn-icon"/>
                                    <div className="btn-bg-slide"></div>
                                </button>
                            </div>

                            {showTeamForm && (
                                <div className="admin-form">
                                    <h3>{editingTeam ? t('editTeam') : t('newTeam')}</h3>
                                    <div className="admin-form-group">
                                        <label>{t('teamName')}</label>
                                        <input
                                            value={teamForm.name}
                                            onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label>{t('roleDescription')}</label>
                                        <textarea
                                            value={teamForm.description}
                                            onChange={(e) => setTeamForm({...teamForm, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="admin-form-buttons">
                                        <button className="btn-cancel" onClick={() => { setShowTeamForm(false); setEditingTeam(null); }}>
                                            <span className="btn-text">{t('cancel')}</span>
                                            <img src="https://img.icons8.com/?size=96&id=DXECg4JU1n2x&format=png" alt="Cancel" className="btn-icon"/>
                                            <div className="btn-bg-slide"></div>
                                        </button>
                                        <button className="btn-save" onClick={handleSaveTeam}>
                                            <span className="btn-text">{t('save')}</span>
                                            <img src="https://img.icons8.com/?size=96&id=9419591&format=png" alt="Save" className="btn-icon"/>
                                            <div className="btn-bg-slide"></div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>{t('teamName')}</th>
                                            <th>{t('roleDescription')}</th>
                                            <th>{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teams.map(team => (
                                            <tr key={team.id}>
                                                <td>{team.id}</td>
                                                <td>{team.name}</td>
                                                <td>{team.description || '—'}</td>
                                                <td>
                                                    <button
                                                        className="admin-action-btn edit"
                                                        onClick={() => { setEditingTeam(team); setTeamForm({ name: team.name, description: team.description || '' }); setShowTeamForm(true); }}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="admin-action-btn delete"
                                                        onClick={() => handleDeleteTeam(team.id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPanel