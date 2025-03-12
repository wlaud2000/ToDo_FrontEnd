// src/services/todo.js
import api from './api'

const todoService = {
  // 새로운 Todo 생성
  createTodo: async (content) => {
    try {
      const response = await api.post('/api/todos', { content })
      return response.data.result
    } catch (error) {
      throw error
    }
  },
  
  // Todo 목록 조회 (페이지네이션 포함)
  getTodos: async (cursor, limit = 10) => {
    try {
      // API 경로에 맞게 수정 (커서 기반 페이지네이션)
      const url = cursor 
        ? `/api/todos?cursor=${cursor}&offset=${limit}`
        : `/api/todos?offset=${limit}`
      
      const response = await api.get(url)
      return response.data.result
    } catch (error) {
      throw error
    }
  },
  
  // Todo 내용 수정
  updateTodoContent: async (todoId, content) => {
    try {
      const response = await api.patch(`/api/todos/${todoId}`, { content })
      return response.data.result
    } catch (error) {
      throw error
    }
  },
  
  // Todo 상태 토글 (완료/미완료)
  updateTodoStatus: async (todoId) => {
    try {
      const response = await api.patch(`/api/todos/${todoId}/toggle`)
      return response.data.result
    } catch (error) {
      throw error
    }
  },
  
  // Todo 삭제
  deleteTodo: async (todoId) => {
    try {
      await api.delete(`/api/todos/${todoId}`)
      return true
    } catch (error) {
      throw error
    }
  }
}

export default todoService