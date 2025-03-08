// src/services/auth.js
import api from './api'

const authService = {
  // 로그인
  login: async (email, password) => {
    try {
      const response = await api.post('/members/login', { email, password })
      // 토큰을 로컬 스토리지에 저장
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // 회원가입
  register: async (username, email, password) => {
    try {
      return await api.post('/members/signup', { username, email, password })
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