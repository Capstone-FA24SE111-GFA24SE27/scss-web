const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost'

export const API_BASE_URL = `${SERVER_BASE_URL}:8080`
export const SOCKET_BASE_URL = `${SERVER_BASE_URL}:9092`