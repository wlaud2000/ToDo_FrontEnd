// src/services/api.js
import axios from 'axios'

// 백엔드 서버 URL - 필요에 따라 수정하세요
const API_URL = 'http://localhost:8080/api'

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터: 인증 토큰 추가
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default api