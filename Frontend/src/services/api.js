import axios from 'axios'

const API_URL = 'http://localhost:5257/api'

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

export const registerUser = async (userData) => {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
}

export const loginUser = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials)
    const data = response.data
    const user = data.user || data.data || data
    if (user && (user.id || user.userId)) {
        localStorage.setItem('currentUser', JSON.stringify(user))
    }
    return response.data
}

export const logoutUser = async () => {
    localStorage.removeItem('currentUser')
    await apiClient.post('/auth/logout')
}

export const getCurrentUser = () => {
    const user = localStorage.getItem('currentUser')
    return user ? JSON.parse(user) : null
}

export const getAssignments = async () => {
    const response = await apiClient.get('/assignment')
    return response.data
}

export const getAssignmentById = async (id) => {
    const response = await apiClient.get(`/assignment/${id}`)
    return response.data
}

export const createTask = async (taskData) => {
    const response = await apiClient.post('/assignment', taskData)
    return response.data
}

export const updateTask = async (id, taskData) => {
    // Backend принимает PUT /api/assignment (без id в роуте)
    const response = await apiClient.put(`/assignment`, taskData)
    return response.data
}

export const deleteTask = async (id) => {
    const response = await apiClient.delete(`/assignment/${id}`)
    return response.data
}

export const updateTaskStatus = async (id, statusId) => {
    // Преобразуем числовой ID статуса в строковое значение для бекенда
    const statusMap = {
        1: 'todo',
        2: 'in-progress',
        3: 'done'
    }
    const status = statusMap[statusId] || 'todo'
    const response = await apiClient.patch(`/assignment/status?assigmentId=${id}&status=${status}`)
    return response.data
}

export const updateTaskContent = async (id, content) => {
    const response = await apiClient.patch(`/assignment/${id}/content`, content)
    return response.data
}

export const changeTaskOwner = async (id, newUserId) => {
    const response = await apiClient.patch(`/assignment/${id}/owner`, newUserId)
    return response.data
}

export const getTeams = async () => {
    const response = await apiClient.get('/team')
    return response.data
}

export const getTeamById = async (id) => {
    const response = await apiClient.get(`/team/${id}`)
    const teamData = response.data

    // Если бэкенд возвращает members, используем их
    if (teamData && teamData.members && Array.isArray(teamData.members)) {
        // Помечаем лидера среди участников на основе leaderId
        const leaderId = teamData.leaderId || teamData.LeaderId
        if (leaderId) {
            teamData.members.forEach(m => {
                const memberId = m.id || m.userId || m.UserId || m.Id
                if (memberId === leaderId) {
                    m.isLeader = true
                    m.roleName = 'Лидер'
                } else {
                    m.isLeader = false
                    m.roleName = 'Участник'
                }
            })
        }
    } else if (teamData && (teamData.leaderId || teamData.LeaderId)) {
        // Если members нет вообще, создаём список с лидером
        const leaderId = teamData.leaderId || teamData.LeaderId
        teamData.members = [{
            id: leaderId,
            userId: leaderId,
            isLeader: true,
            roleName: 'Лидер'
        }]
    }

    return teamData
}

export const createTeam = async (formData) => {
    const response = await apiClient.post('/team', formData)
    const createdTeam = response.data

    // После создания команды, возвращаем обновлённые данные с лидером в составе участников
    if (createdTeam && createdTeam.id) {
        const leaderId = formData.LeaderId || formData.leaderId
        if (leaderId) {
            try {
                // Обновляем данные команды с участниками
                const updatedTeam = await getTeamById(createdTeam.id)
                return updatedTeam
            } catch (error) {
                console.error('Ошибка при загрузке данных команды:', error)
            }
        }
    }

    return createdTeam
}

export const updateTeam = async (id, teamData) => {
    const response = await apiClient.put(`/team/${id}`, teamData)
    return response.data
}

export const deleteTeam = async (id) => {
    const response = await apiClient.delete(`/team/${id}`)
    return response.data
}

export const addUserToTeam = async (teamId, userId) => {
    try {
        const response = await apiClient.post(`/team/${teamId}/users/${userId}`)
        return response.data
    } catch (error) {
        // Пробрасываем ошибку дальше, чтобы обработчик в компоненте мог её поймать
        throw error
    }
}

export const getUsers = async () => {
    const response = await apiClient.get('/user')
    return response.data
}

export const getUserById = async (id) => {
    try {
        const response = await apiClient.get(`/user/${id}`)
        return response.data
    } catch (error) {
        // Пробрасываем ошибку дальше, чтобы обработчик в компоненте мог её поймать
        throw error
    }
}

export const getTeamTasks = async (teamId) => {
    const response = await apiClient.get(`/teamAssignment/team/${teamId}`)
    return response.data
}

export const createTeamTask = async (teamId, taskData) => {
    const response = await apiClient.post('/teamAssignment', {
        teamId: teamId,
        name: taskData.title || taskData.name,
        description: taskData.description,
        priority: taskData.priority,
        deadline: taskData.deadline
    })
    return response.data
}

export const updateTeamTask = async (teamId, taskId, taskData) => {
    const response = await apiClient.put('/teamAssignment', {
        id: taskId,
        name: taskData.title || taskData.name,
        description: taskData.description,
        statusId: taskData.statusId,
        userId: taskData.userId,
        priority: taskData.priority,
        deadline: taskData.deadline
    })
    return response.data
}

export const deleteTeamTask = async (teamId, taskId) => {
    const response = await apiClient.delete(`/teamAssignment/${taskId}`)
    return response.data
}

export const updateTeamTaskStatus = async (taskId, status, userId = null) => {
    const statusIdMap = {
        'todo': 1,
        'in-progress': 2,
        'done': 3
    }
    const statusId = statusIdMap[status] || 1

    const response = await apiClient.put('/teamAssignment', {
        id: taskId,
        statusId: statusId,
        userId: userId !== null ? userId : undefined
    })
    return response.data
}

export const takeTeamTask = async (taskId, userId) => {
    const response = await apiClient.put('/teamAssignment', {
        id: taskId,
        statusId: 2,
        userId: userId
    })
    return response.data
}

export const getTeamTaskById = async (taskId) => {
    const response = await apiClient.get(`/teamAssignment/${taskId}`)
    return response.data
}

export const removeUserFromTeam = async (teamId, userId) => {
    const response = await apiClient.delete(`/team/${teamId}/users/${userId}`)
    return response.data
}

export const changeTeamLeader = async (teamId, userId) => {
    const response = await apiClient.patch(`/team/${teamId}/leader/${userId}`)
    return response.data
}

export const deleteTeamTasks = async (teamId) => {
    const tasks = await getTeamTasks(teamId)
    for (const task of tasks) {
        await deleteTeamTask(teamId, task.id)
    }
}

export const uploadTeamAvatar = async (teamId, file) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post(`/team/${teamId}/avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

export const updateTeamName = async (teamId, teamData) => {
    const response = await apiClient.put('/team', teamData)
    return response.data
}