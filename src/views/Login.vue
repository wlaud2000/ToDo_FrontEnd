<template>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header text-center">
            <h4>로그인</h4>
          </div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">
              {{ error }}
            </div>
            
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">이메일</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="email" 
                  required
                  placeholder="이메일을 입력하세요"
                >
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">비밀번호</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model="password" 
                  required
                  placeholder="비밀번호를 입력하세요"
                >
              </div>
              
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  {{ loading ? '로그인 중...' : '로그인' }}
                </button>
              </div>
            </form>
            
            <hr />
            <p class="text-center">
              계정이 없으신가요? <router-link to="/register">회원가입</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import authService from '../services/auth'
  
  export default {
    setup() {
      const email = ref('')
      const password = ref('')
      const error = ref('')
      const loading = ref(false)
      const router = useRouter()
      
      const handleLogin = async () => {
        loading.value = true
        error.value = ''
        
        try {
          await authService.login(email.value, password.value)
          // 로그인 성공 후 할 일 목록 페이지로 이동
          router.push('/todos')
        } catch (err) {
          console.error('Login error:', err)
          error.value = err.response?.data?.message || '로그인에 실패했습니다.'
        } finally {
          loading.value = false
        }
      }
      
      return {
        email,
        password,
        error,
        loading,
        handleLogin
      }
    }
  }
  </script>