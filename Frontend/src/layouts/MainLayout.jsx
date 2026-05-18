import React, { useEffect, useState } from 'react'
import './MainLayout.css'
import { useTranslation } from '../i18n/LanguageContext'
import { getAssignments, getCurrentUser, updateTask, deleteTask, updateTaskStatus } from '../services/api'

import AddTaskModal from '../features/Tasks/components/AddTaskModal'
import DeleteTaskModal from '../features/Tasks/components/DeleteTaskModal'
import EditTaskModal from '../features/Tasks/components/EditTaskModal'
import TaskCard from '../features/Tasks/components/TaskCard'
import TeamStartWindow from '../features/Teams/components/TeamStartWindow'
import TaskDescriptionModal from '../features/Tasks/components/TaskDescriptionModal'
import ProfileModal from '../features/Profile/components/ProfileModal'
import SettingsModal from '../features/Settings/components/SettingsModal'
import CloseTaskModal from '../features/Tasks/components/CloseTaskModal'
import AdminPanel from '../features/AdminPanel/AdminPanel'

function MainLayout({ onLogout }) {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState([])
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isCloseOpen, setIsCloseOpen] = useState(false)
    const [selectedTaskForDesc, setSelectedTaskForDesc] = useState(null)
    const [isTeamOpen, setIsTeamOpen] = useState(false)
    const [currentTask, setCurrentTask] = useState(null)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)

    // Фильтр задач
    const [filterType, setFilterType] = useState('all') // 'all', 'open', 'closed'
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const filterContainerRef = React.useRef(null)

    // Сортировка задач
    const [sortType, setSortType] = useState('dateCreatedAsc') // 'dateCreatedAsc', 'dateCreatedDesc', 'priorityAsc', 'priorityDesc', 'deadlineAsc', 'deadlineDesc'
    const [isSortOpen, setIsSortOpen] = useState(false)
    const sortContainerRef = React.useRef(null)

    // Закрытие шторки фильтра при клике вне её области
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterContainerRef.current && !filterContainerRef.current.contains(event.target)) {
                setIsFilterOpen(false)
            }
            if (sortContainerRef.current && !sortContainerRef.current.contains(event.target)) {
                setIsSortOpen(false)
            }
        }

        if (isFilterOpen || isSortOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isFilterOpen, isSortOpen])

    const normalizeTask = (raw) => {
        if (!raw || typeof raw !== 'object') return raw
        return {
            ...raw,
            id: raw.id ?? raw.Id ?? raw.assignmentId ?? raw.AssignmentId,
            title: raw.title ?? raw.Title ?? '',
            description: raw.description ?? raw.Description ?? '',
            priority: raw.priority ?? raw.Priority ?? null,
            deadline: raw.deadline ?? raw.Deadline ?? null,
            createdAt: raw.createdAt ?? raw.CreatedAt ?? raw.created ?? raw.Created ?? null,
            updatedAt: raw.updatedAt ?? raw.UpdatedAt ?? raw.editedAt ?? raw.EditedAt ?? null,
            teamId: raw.teamId ?? raw.TeamId ?? null,
            userId: raw.userId ?? raw.UserId ?? null,
            assigneeId: raw.assigneeId ?? raw.AssigneeId ?? null,
        }
    }

    useEffect(() => {
        const user = getCurrentUser()
        setCurrentUser(user?.id ?? user?.userId ?? null)
        // Check if user is admin (roleId = 2 for Admin as per task requirement)
        setIsAdmin(user?.roleId === 2 || false)
    }, [])

    useEffect(() => {
        if (currentUser === null) return

        let cancelled = false

        const load = async () => {
            try {
                const data = await getAssignments()
                if (cancelled) return
                const normalized = Array.isArray(data) ? data.map(normalizeTask) : []
                const userTasks = normalized.filter(task =>
                    !task.teamId &&
                    (task.userId === currentUser || task.assigneeId === currentUser)
                )
                setTasks(userTasks)
            } catch (e) {
                if (cancelled) return
                setTasks([])
            }
        }

        load()
        return () => { cancelled = true }
    }, [currentUser])

    const handleSaveTask = (createdTask) => {
        const normalized = normalizeTask(createdTask)
        setTasks(prev => [...prev, normalized])
    }

    const openEditModal = (task) => {
        setCurrentTask(task)
        setIsEditOpen(true)
    }

    const handleUpdateTask = async (updatedTask) => {
        try {
            await updateTask(updatedTask.id, {
                assigmentId: updatedTask.id,
                userId: currentUser,
                title: updatedTask.title,
                description: updatedTask.description,
                priority: updatedTask.priority,
                deadline: updatedTask.deadline
            })
        } catch (e) {
            console.error('Ошибка при обновлении задачи:', e)
        } finally {
            const data = await getAssignments()
            const refreshed = Array.isArray(data) ? data.map(normalizeTask) : []
            const userTasks = refreshed.filter(task =>
                !task.teamId &&
                (task.userId === currentUser || task.assigneeId === currentUser)
            )
            setTasks(userTasks)
            setIsEditOpen(false)
            setCurrentTask(null)
        }
    }

    const openDeleteModal = (task) => {
        setCurrentTask(task)
        setIsDeleteOpen(true)
    }

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId)
        } catch (e) {
            console.error('Ошибка при удалении задачи:', e)
        } finally {
            const data = await getAssignments()
            const refreshed = Array.isArray(data) ? data.map(normalizeTask) : []
            const userTasks = refreshed.filter(task =>
                !task.teamId &&
                (task.userId === currentUser || task.assigneeId === currentUser)
            )
            setTasks(userTasks)
            setIsDeleteOpen(false)
            setCurrentTask(null)
        }
    }

    const openDescModal = (task) => {
        setSelectedTaskForDesc(task)
    }

    // Обработчики для закрытия/переоткрытия задач
    const openCloseModal = (task) => {
        setCurrentTask(task)
        setIsCloseOpen(true)
    }

    const handleConfirmCloseTask = async () => {
        if (!currentTask) return
        try {
            // Обновляем статус задачи на 'done' (закрыто)
            await updateTaskStatus(currentTask.id, 3) // 3 = done
        } catch (e) {
            console.error('Ошибка при закрытии задачи:', e)
        } finally {
            // Перезагружаем список задач
            const data = await getAssignments()
            const refreshed = Array.isArray(data) ? data.map(normalizeTask) : []
            const userTasks = refreshed.filter(task =>
                !task.teamId &&
                (task.userId === currentUser || task.assigneeId === currentUser)
            )
            setTasks(userTasks)
            setIsCloseOpen(false)
            setCurrentTask(null)
        }
    }

    const handleReopenTask = async (task) => {
        try {
            // Обновляем статус задачи на 'todo' (открыто)
            await updateTaskStatus(task.id, 1) // 1 = todo
        } catch (e) {
            console.error('Ошибка при переоткрытии задачи:', e)
        } finally {
            // Перезагружаем список задач
            const data = await getAssignments()
            const refreshed = Array.isArray(data) ? data.map(normalizeTask) : []
            const userTasks = refreshed.filter(task =>
                !task.teamId &&
                (task.userId === currentUser || task.assigneeId === currentUser)
            )
            setTasks(userTasks)
        }
    }

    // Фильтрация задач
    const filteredTasks = tasks.filter(task => {
        const isClosed = task.status === 'done' || task.isClosed === true
        if (filterType === 'open') return !isClosed
        if (filterType === 'closed') return isClosed
        return true // 'all' - показываем все
    })

    // Сортировка задач
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        // Функция для получения числового значения приоритета
        // low (зеленый) = 1, medium (желтый) = 2, high (красный) = 3
        const getPriorityValue = (priority) => {
            if (priority === 'low') return 1
            if (priority === 'medium') return 2
            if (priority === 'high') return 3
            return 999 // задачи без приоритета в конец
        }

        if (sortType === 'priorityAsc') {
            // По важности по возрастанию (зелёный/низкая -> жёлтый/средняя -> красная/высокая)
            return getPriorityValue(a.priority) - getPriorityValue(b.priority)
        } else if (sortType === 'priorityDesc') {
            // По важности по убыванию (красная/высокая -> жёлтый/средняя -> зелёный/низкая)
            return getPriorityValue(b.priority) - getPriorityValue(a.priority)
        } else if (sortType === 'deadlineAsc') {
            // Сортировка по дате дедлайна по возрастанию (ранние дедлайны сначала)
            const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Infinity
            const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Infinity
            return aDeadline - bDeadline
        } else if (sortType === 'deadlineDesc') {
            // Сортировка по дате дедлайна по убыванию (поздние дедлайны сначала)
            const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Infinity
            const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Infinity
            return bDeadline - aDeadline
        } else if (sortType === 'dateCreatedDesc') {
            // По дате создания по убыванию (новые сначала)
            const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return bCreated - aCreated
        } else {
            // По умолчанию - по дате создания по возрастанию (старые сначала)
            const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return aCreated - bCreated
        }
    })

    return (
        <>
            <div className="animated-bg-waves">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
            </div>

            <section className="leftPanel">
                <div id="rectangle-left-panel" className="glass-panel">

                    <div className="panel-top-group">
                        <button
                            id="profile-icon"
                            className="icon"
                            onClick={() => setIsProfileOpen(true)}
                            title={t('navProfile')}
                            aria-label={t('navProfile')}
                        >
                            <svg className="icon-svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="120 400" strokeDashoffset="120"/></svg>
                            <img src="https://img.icons8.com/?size=96&id=p8UFrp2VUgHR&format=png" alt={t('navProfile')} className="img-default"/>
                            <span className="icon-text">{t('navProfile')}</span>
                        </button>

                        <button
                            id="team-icon"
                            className="icon"
                            onClick={() => setIsTeamOpen(true)}
                            title={t('navTeams')}
                            aria-label={t('navTeams')}
                        >
                            <svg className="icon-svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="120 400" strokeDashoffset="120"/></svg>
                            <img src="https://img.icons8.com/?size=96&id=aSlhg0UOn67Q&format=png" alt={t('navTeams')} className="img-default"/>
                            <span className="icon-text">{t('navTeams')}</span>
                        </button>

                        <button
                            id="quests-icon"
                            className="icon"
                            title={t('navTasks')}
                            aria-label={t('navTasks')}
                        >
                            <svg className="icon-svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="120 400" strokeDashoffset="120"/></svg>
                            <img src="https://img.icons8.com/?size=96&id=ljwCE5MTJHVo&format=png" alt={t('navTasks')} className="img-default"/>
                            <span className="icon-text">{t('navTasks')}</span>
                        </button>
                    </div>

                    <button
                        id="settings-icon"
                        className="icon"
                        onClick={() => setIsSettingsOpen(true)}
                        title={t('navSettings')}
                        aria-label={t('navSettings')}
                    >
                        <svg className="icon-svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="120 400" strokeDashoffset="120"/></svg>
                        <img src="https://img.icons8.com/?size=96&id=xyFoc6U1Hu3c&format=png" alt={t('navSettings')} className="img-default"/>
                        <span className="icon-text">{t('navSettings')}</span>
                    </button>

                    {isAdmin && (
                        <button
                            id="admin-icon"
                            className="icon"
                            onClick={() => setIsAdminPanelOpen(true)}
                            title="Админ-панель"
                            aria-label="Админ-панель"
                        >
                            <svg className="icon-svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="120 400" strokeDashoffset="120"/></svg>
                            <img src="https://img.icons8.com/?size=96&id=gB3JliGa2aJ8&format=png" alt="Админ-панель" className="img-default"/>
                            <span className="icon-text">Админ-панель</span>
                        </button>
                    )}
                </div>
            </section>

            <section className="top-panel">
                <div id="rectangle-top-panel" className="glass-panel">
                    <h1>SaveYourTime</h1>

                    <button
                        id="add-task-icon"
                        className="icon"
                        onClick={() => setIsAddOpen(true)}
                        title={t('addTask')}
                        aria-label={t('addTask')}
                    >
                        <svg className="icon-svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="120 400" strokeDashoffset="120"/></svg>
                        <img src="https://img.icons8.com/?size=96&id=1OvPrBUWbMke&format=png" alt={t('addTask')} className="img-default"/>
                        <span className="icon-text">{t('addTask')}</span>
                    </button>
                </div>
            </section>

            <div className="tasks-panel-container">
                {sortedTasks.length > 0 && (
                <div className="tasks-dark-header">
                    <div className="filter-sort-buttons-wrapper">
                        <div className="filter-dropdown-container" ref={filterContainerRef}>
                            <button
                                id="filter-btn"
                                className="filter-toggle-btn"
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                            >
                                <img src="https://img.icons8.com/?size=96&id=lIPVBw1hMKkS&format=png" alt="Фильтр" className="img-default"/>
                                <span className="icon-text" style={{marginLeft: 50}}>Фильтр</span>
                            </button>

                            {isFilterOpen && (
                                <div className="filter-dropdown">
                                    <button
                                        className={`filter-option ${filterType === 'all' ? 'active' : ''}`}
                                        onClick={() => { setFilterType('all'); setIsFilterOpen(false); }}
                                    >
                                        Все
                                    </button>
                                    <button
                                        className={`filter-option ${filterType === 'open' ? 'active' : ''}`}
                                        onClick={() => { setFilterType('open'); setIsFilterOpen(false); }}
                                    >
                                        Открытые
                                    </button>
                                    <button
                                        className={`filter-option ${filterType === 'closed' ? 'active' : ''}`}
                                        onClick={() => { setFilterType('closed'); setIsFilterOpen(false); }}
                                    >
                                        Закрытые
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="sort-dropdown-container" ref={sortContainerRef}>
                            <button
                                id="sort-btn"
                                className="sort-toggle-btn"
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                title="Сортировка задач"
                                aria-label="Сортировка задач"
                            >
                                <img src="https://img.icons8.com/?size=96&id=8P1z54VQlHYr&format=png" alt="Сортировка" className="img-default"/>
                                <span className="icon-text">Сортировка</span>
                            </button>

                            {isSortOpen && (
                                <div className="sort-dropdown">
                                    <button
                                        className={`sort-option ${sortType === 'dateCreatedAsc' ? 'active' : ''}`}
                                        onClick={() => { setSortType('dateCreatedAsc'); setIsSortOpen(false); }}
                                    >
                                        По дате создания
                                        <img src="https://img.icons8.com/?size=96&id=r5snZmRTalHS&format=png" alt="asc" className="sort-icon-img"/>
                                    </button>
                                    <button
                                        className={`sort-option ${sortType === 'dateCreatedDesc' ? 'active' : ''}`}
                                        onClick={() => { setSortType('dateCreatedDesc'); setIsSortOpen(false); }}
                                    >
                                        По дате создания
                                        <img src="https://img.icons8.com/?size=96&id=ZZmSz9gZBY64&format=png" alt="desc" className="sort-icon-img"/>
                                    </button>
                                    <button
                                        className={`sort-option ${sortType === 'deadlineAsc' ? 'active' : ''}`}
                                        onClick={() => { setSortType('deadlineAsc'); setIsSortOpen(false); }}
                                    >
                                        По дате дедлайна
                                        <img src="https://img.icons8.com/?size=96&id=r5snZmRTalHS&format=png" alt="asc" className="sort-icon-img"/>
                                    </button>
                                    <button
                                        className={`sort-option ${sortType === 'deadlineDesc' ? 'active' : ''}`}
                                        onClick={() => { setSortType('deadlineDesc'); setIsSortOpen(false); }}
                                    >
                                        По дате дедлайна
                                        <img src="https://img.icons8.com/?size=96&id=ZZmSz9gZBY64&format=png" alt="desc" className="sort-icon-img"/>
                                    </button>
                                    <button
                                        className={`sort-option ${sortType === 'priorityAsc' ? 'active' : ''}`}
                                        onClick={() => { setSortType('priorityAsc'); setIsSortOpen(false); }}
                                    >
                                        По важности
                                        <img src="https://img.icons8.com/?size=96&id=r5snZmRTalHS&format=png" alt="asc" className="sort-icon-img"/>
                                    </button>
                                    <button
                                        className={`sort-option ${sortType === 'priorityDesc' ? 'active' : ''}`}
                                        onClick={() => { setSortType('priorityDesc'); setIsSortOpen(false); }}
                                    >
                                        По важности
                                        <img src="https://img.icons8.com/?size=96&id=ZZmSz9gZBY64&format=png" alt="desc" className="sort-icon-img"/>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                )}

                <div className="tasks-scroll-wrapper custom-scrollbar">
                    <div className="tasks-grid">
                        {sortedTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={openEditModal}
                                onDelete={openDeleteModal}
                                onViewDetails={() => openDescModal(task)}
                                onCloseTask={openCloseModal}
                                onReopenTask={handleReopenTask}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <AddTaskModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSave={handleSaveTask}
                token={localStorage.getItem('token')}
                teamId={null}
            />

            {isEditOpen && currentTask && (
                <EditTaskModal task={currentTask} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onSave={handleUpdateTask} />
            )}

            {isDeleteOpen && currentTask && (
                <DeleteTaskModal task={currentTask} isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={() => handleDeleteTask(currentTask.id)} />
            )}

            {selectedTaskForDesc && (
                <TaskDescriptionModal
                    task={selectedTaskForDesc}
                    isOpen={!!selectedTaskForDesc}
                    onClose={() => setSelectedTaskForDesc(null)}
                />
            )}

            <CloseTaskModal
                isOpen={isCloseOpen}
                onClose={() => setIsCloseOpen(false)}
                onConfirm={handleConfirmCloseTask}
            />

            <TeamStartWindow isOpen={isTeamOpen} onClose={() => setIsTeamOpen(false)} />

            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onLogout={onLogout}
            />

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            {isAdminPanelOpen && (
                <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
            )}
        </>
    )
}

export default MainLayout