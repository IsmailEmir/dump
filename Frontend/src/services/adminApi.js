import axios from 'axios'

const API_URL = 'http://localhost:5257/api'

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

// Admin stats
export const getAdminStats = async () => {
    const response = await apiClient.get('/admin/stats')
    return response.data
}

// Users
export const getAllUsers = async () => {
    const response = await apiClient.get('/admin/users')
    return response.data
}

export const getUserById = async (id) => {
    const response = await apiClient.get(`/admin/users/${id}`)
    return response.data
}

export const getUsersByFilter = async (username, roleId) => {
    const params = {}
    if (username) params.username = username
    if (roleId) params.roleId = roleId
    const response = await apiClient.get('/admin/users/filter', { params })
    return response.data
}

export const createUser = async (userData) => {
    const response = await apiClient.post('/admin/users', userData)
    return response.data
}

export const updateUser = async (userData) => {
    const response = await apiClient.put('/admin/users', userData)
    return response.data
}

export const deleteUser = async (id) => {
    const response = await apiClient.delete(`/admin/users/${id}`)
    return response.data
}

export const changeUserRole = async (id, roleId) => {
    const response = await apiClient.patch(`/admin/users/${id}/role`, roleId, {
        headers: { 'Content-Type': 'application/json' }
    })
    return response.data
}

// Roles
export const getAllRoles = async () => {
    const response = await apiClient.get('/admin/roles')
    return response.data
}

export const getRoleById = async (id) => {
    const response = await apiClient.get(`/admin/roles/${id}`)
    return response.data
}

export const getRolesByFilter = async (filter) => {
    const response = await apiClient.get('/admin/roles/filter', { params: { filter } })
    return response.data
}

export const createRole = async (roleData) => {
    const response = await apiClient.post('/admin/roles', roleData)
    return response.data
}

export const updateRole = async (roleData) => {
    const response = await apiClient.put('/admin/roles', roleData)
    return response.data
}

export const deleteRole = async (id) => {
    const response = await apiClient.delete(`/admin/roles/${id}`)
    return response.data
}

// Assignments
export const getAllAssignments = async () => {
    const response = await apiClient.get('/admin/assignments')
    return response.data
}

export const getAssignmentById = async (id) => {
    const response = await apiClient.get(`/admin/assignments/${id}`)
    return response.data
}

export const getAssignmentsByFilter = async (filterData) => {
    const response = await apiClient.get('/admin/assignments/filter', { params: filterData })
    return response.data
}

export const createAssignment = async (assignmentData) => {
    const response = await apiClient.post('/admin/assignments', assignmentData)
    return response.data
}

export const updateAssignment = async (assignmentData) => {
    const response = await apiClient.put('/admin/assignments', assignmentData)
    return response.data
}

export const deleteAssignment = async (id) => {
    const response = await apiClient.delete(`/admin/assignments/${id}`)
    return response.data
}

export const updateAssignmentStatus = async (id, status) => {
    const response = await apiClient.patch(`/admin/assignments/${id}/status`, status, {
        headers: { 'Content-Type': 'application/json' }
    })
    return response.data
}

export const changeAssignmentOwner = async (id, newUserId) => {
    const response = await apiClient.patch(`/admin/assignments/${id}/owner`, newUserId, {
        headers: { 'Content-Type': 'application/json' }
    })
    return response.data
}

// Teams
export const getAllTeams = async () => {
    const response = await apiClient.get('/admin/teams')
    return response.data
}

export const getTeamById = async (id) => {
    const response = await apiClient.get(`/admin/teams/${id}`)
    return response.data
}

export const getTeamUsers = async (teamId) => {
    const response = await apiClient.get(`/admin/teams/${teamId}/users`)
    return response.data
}

export const createTeam = async (teamData) => {
    const response = await apiClient.post('/admin/teams', teamData)
    return response.data
}

export const updateTeam = async (teamData) => {
    const response = await apiClient.put('/admin/teams', teamData)
    return response.data
}

export const deleteTeam = async (id) => {
    const response = await apiClient.delete(`/admin/teams/${id}`)
    return response.data
}

export const addUserToTeam = async (teamId, userId) => {
    const response = await apiClient.post(`/admin/teams/${teamId}/users/${userId}`)
    return response.data
}

export const removeUserFromTeam = async (teamId, userId) => {
    const response = await apiClient.delete(`/admin/teams/${teamId}/users/${userId}`)
    return response.data
}

export const setTeamLeader = async (teamId, userId) => {
    const response = await apiClient.patch(`/admin/teams/${teamId}/leader/${userId}`)
    return response.data
}

// Team Assignments
export const getTeamAssignmentsByTeam = async (teamId) => {
    const response = await apiClient.get(`/admin/team-assignments/${teamId}`)
    return response.data
}

export const getTeamAssignmentById = async (id) => {
    const response = await apiClient.get(`/admin/team-assignments/detail/${id}`)
    return response.data
}

export const createTeamAssignment = async (assignmentData) => {
    const response = await apiClient.post('/admin/team-assignments', assignmentData)
    return response.data
}

export const updateTeamAssignment = async (assignmentData) => {
    const response = await apiClient.put('/admin/team-assignments', assignmentData)
    return response.data
}

export const deleteTeamAssignment = async (id) => {
    const response = await apiClient.delete(`/admin/team-assignments/${id}`)
    return response.data
}