import React, { useState } from 'react'
import '../styles.css'
import '../../../styles/common-ui.css'
import '../../Tasks/styles.css'

import AddTaskModal from '../../Tasks/components/AddTaskModal'
import EditTaskModal from '../../Tasks/components/EditTaskModal'
import DeleteTaskModal from '../../Tasks/components/DeleteTaskModal'
import TeamTaskCard from './TeamTaskCard'
import ConfirmMoveModal from './ConfirmMoveModal'
import WarningModal from './WarningModal'
import DettailTeamTaskCard from './DettailTeamTaskCard'

export default function TeamTasksWindow({ teamData, onClose }) {
    const [tasks, setTasks] = useState([])
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [currentTask, setCurrentTask] = useState(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isWarningOpen, setIsWarningOpen] = useState(false)
    const [pendingMove, setPendingMove] = useState(null)
    const [activeCategory, setActiveCategory] = useState('todo')
    
    // ДОБАВЛЕНО: состояния для просмотра деталей
    const [viewTask, setViewTask] = useState(null)
    const [isViewOpen, setIsViewOpen] = useState(false)

    if (!teamData) return null

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
            status: raw.status ?? raw.Status ?? raw.statusId ?? raw.StatusId ?? raw.state ?? raw.State,
        }
    }

    const handleAddTask = (newTask) => {
        const normalized = normalizeTask(newTask)
        const taskWithId = {
            ...normalized,
            id: normalized?.id ?? Date.now(),
            status: normalized?.status ?? 'todo',
            createdAt: normalized?.createdAt ?? new Date().toISOString(),
        }
        setTasks([...tasks, taskWithId])
        setIsAddOpen(false)
    }

    const openEditModal = (task) => {
        setCurrentTask(task)
        setIsEditOpen(true)
    }

    const handleUpdateTask = (updatedTask) => {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
        setIsEditOpen(false)
        setCurrentTask(null)
    }

    const openDeleteModal = (task) => {
        setCurrentTask(task)
        setIsDeleteOpen(true)
    }

    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter(t => t.id !== taskId))
        setIsDeleteOpen(false)
        setCurrentTask(null)
    }

    // ДОБАВЛЕНО: функция для открытия окна деталей
    const openViewDetails = (task) => {
        setViewTask(task)
        setIsViewOpen(true)
    }

    const executeMove = (taskId, newStatus) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
        ))
    }

    const getStatusChangeInfo = (currentStatus, newStatus) => {
        if (currentStatus === newStatus) return null
        if (currentStatus === 'done' && newStatus === 'in-progress') return { message: 'Невозможно перенести задачу в эту колонку.', type: 'warning' }
        if (currentStatus === 'done' && newStatus === 'todo') return { message: 'Вы точно хотите переоткрыть задачу?', type: 'confirm' }
        if (currentStatus === 'in-progress' && newStatus === 'todo') return { message: 'Вы точно хотите перенести задачу в эту колонку?', type: 'confirm' }
        if (currentStatus === 'todo' && newStatus === 'done') return { message: 'Вы уверены , что задачу можно решить именно таким способом?', type: 'confirm' }
        if (currentStatus === 'todo' && newStatus === 'in-progress') return { message: 'Вы хотите взять задачу?', type: 'confirm' }
        if (currentStatus === 'in-progress' && newStatus === 'done') return { message: 'Вы готовы завершить задачу?', type: 'confirm' }
        return null
    }

    const handleActionClick = (taskId, newStatus) => {
        const task = tasks.find(t => t.id === taskId)
        if (!task) return
        const info = getStatusChangeInfo(task.status, newStatus)
        if (!info) {
            executeMove(taskId, newStatus)
            return
        }
        setPendingMove({ taskId, newStatus, message: info.message, type: info.type })
        if (info.type === 'warning') {
            setIsWarningOpen(true)
        } else {
            setIsConfirmOpen(true)
        }
    }

    const confirmAction = () => {
        if (pendingMove) {
            executeMove(pendingMove.taskId, pendingMove.newStatus)
            setPendingMove(null)
            setIsConfirmOpen(false)
        }
    }

    const cancelAction = () => {
        setPendingMove(null)
        setIsConfirmOpen(false)
    }

    const closeWarning = () => {
        setPendingMove(null)
        setIsWarningOpen(false)
    }

    const filteredTasks = tasks.filter(t => t.status === activeCategory)

    return (
        <div className="team-tasks-overlay">
            <div className="team-tasks-content glass-panel" onClick={(e) => e.stopPropagation()}>

                <button className="common-close-btn" onClick={onClose}>
                    <img src="https://img.icons8.com/?size=96&id=X3PpUHcCmmeD&format=png" alt="Close" />
                </button>

                <div className="tasks-header">
                    <header>Задачи команды</header>
                    <span className="team-name-subtitle">{teamData.name}</span>
                </div>

                <div className="team-tasks-layout">
                    <div className="team-nav-sidebar">
                        <button 
                            className={`team-nav-btn ${activeCategory === 'todo' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('todo')}
                        >
                            <span className="nav-text">К выполнению</span>
                            <div className="nav-bg-slide"></div>
                        </button>

                        <button 
                            className={`team-nav-btn ${activeCategory === 'in-progress' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('in-progress')}
                        >
                            <span className="nav-text">В процессе</span>
                            <div className="nav-bg-slide"></div>
                        </button>

                        <button 
                            className={`team-nav-btn ${activeCategory === 'done' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('done')}
                        >
                            <span className="nav-text">Выполнено</span>
                            <div className="nav-bg-slide"></div>
                        </button>

                        <button 
                            className="team-nav-btn btn-add-task-nav"
                            onClick={() => setIsAddOpen(true)}
                        >
                            <span className="nav-text">Добавить задачу</span>
                            <div className="nav-bg-slide green-bg"></div>
                        </button>
                    </div>

                    <div className="team-tasks-area custom-scrollbar">
                        {filteredTasks.length === 0 ? (
                            <div className="empty-state">В этой категории задач нет</div>
                        ) : (
                            <div className="tasks-grid">
                                {filteredTasks.map(task => (
                                    <TeamTaskCard 
                                        key={task.id} 
                                        task={task} 
                                        onViewDetails={() => openViewDetails(task)}
                                        onAction={(newStatus) => handleActionClick(task.id, newStatus)}
                                        onEdit={openEditModal}
                                        onDelete={openDeleteModal}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DettailTeamTaskCard 
                    task={viewTask} 
                    isOpen={isViewOpen} 
                    onClose={() => setIsViewOpen(false)} 
                />
            </div>

            <AddTaskModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSave={handleAddTask} />

            {isEditOpen && currentTask && (
                <EditTaskModal task={currentTask} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onSave={handleUpdateTask} />
            )}

            {isDeleteOpen && currentTask && (
                <DeleteTaskModal task={currentTask} isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={() => handleDeleteTask(currentTask.id)} />
            )}

            <ConfirmMoveModal
                isOpen={isConfirmOpen}
                message={pendingMove?.message || ''}
                onConfirm={confirmAction}
                onCancel={cancelAction}
            />

            <WarningModal
                isOpen={isWarningOpen}
                message={pendingMove?.message || ''}
                onClose={closeWarning}
            />
        </div>
    )
}