import axios from 'axios'

const API_URL = 'http://localhost:5257/api'

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
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
    const response = await apiClient.put(`/assignment/${id}`, taskData)
    return response.data
}

export const deleteTask = async (id) => {
    const response = await apiClient.delete(`/assignment/${id}`)
    return response.data
}

export const updateTaskStatus = async (id, statusId) => {
    const response = await apiClient.patch(`/assignment/${id}/status`, statusId)
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
    return response.data
}

export const createTeam = async (teamData) => {
    const response = await apiClient.post('/team', teamData)
    return response.data
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
    const response = await apiClient.post(`/team/${teamId}/add-user`, userId)
    return response.data
}

export const getUsers = async () => {
    const response = await apiClient.get('/user')
    return response.data
}

export const getUserById = async (id) => {
    const response = await apiClient.get(`/user/${id}`)
    return response.data
}