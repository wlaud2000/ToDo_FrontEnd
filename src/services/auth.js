// src/services/auth.js
import api from './api'

const authService = {
  // 로그인
  login: async (email, password) => {
    try {
      const response = await api.post('/api/members/login', { email, password })
      // 토큰을 로컬 스토리지에 저장
      if (response.data.result && response.data.result.token) {
        localStorage.setItem('token', response.data.result.token)
      }
      return response.data.result
    } catch (error) {
      throw error
    }
  },
  
  // 회원가입
  register: async (username, email, password) => {
    try {
      const response = await api.post('/api/members/signup', { 
        username, 
        email, 
        password 
      })
      return response.data.result
    } catch (error) {
      throw error
    }
  },
  
  // 로그아웃
  logout: () => {
    localStorage.removeItem('token')
  },
  
  // 현재 로그인 상태 확인
  isLoggedIn: () => {
    return !!localStorage.getItem('token')
  }
}

export default authService