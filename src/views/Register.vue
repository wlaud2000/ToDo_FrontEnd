<template>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header text-center">
            <h4>회원가입</h4>
          </div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">
              {{ error }}
            </div>
            
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="name" class="form-label">이름</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="name" 
                  v-model="name" 
                  required
                  placeholder="이름을 입력하세요"
                >
              </div>
              
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
              
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">비밀번호 확인</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="confirmPassword" 
                  v-model="confirmPassword" 
                  required
                  placeholder="비밀번호를 다시 입력하세요"
                >
                <div v-if="passwordError" class="text-danger mt-1">
                  {{ passwordError }}
                </div>
              </div>
              
              <div class="mb-3 form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="terms" 
                  v-model="agreeTerms"
                >
                <label class="form-check-label" for="terms">
                  이용약관 및 개인정보처리방침에 동의합니다
                </label>
              </div>
              
              <div class="d-grid">
                <button 
                  type="submit" 
                  class="btn btn-success" 
                  :disabled="loading || !isFormValid"
                >
                  {{ loading ? '가입 중...' : '가입하기' }}
                </button>
              </div>
            </form>
            
            <hr />
            <p class="text-center">
              이미 계정이 있으신가요? <router-link to="/login">로그인</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import authService from '../services/auth'
  
  export default {
    setup() {
      const name = ref('')
      const email = ref('')
      const password = ref('')
      const confirmPassword = ref('')
      const agreeTerms = ref(false)
      const error = ref('')
      const loading = ref(false)
      const router = useRouter()
      
      // 비밀번호 유효성 검사
      const passwordError = computed(() => {
        if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
          return '비밀번호가 일치하지 않습니다.'
        }
        return ''
      })
      
      // 폼 유효성 검사
      const isFormValid = computed(() => {
        return name.value && 
               email.value && 
               password.value && 
               password.value === confirmPassword.value && 
               agreeTerms.value
      })
      
      const handleRegister = async () => {
        if (!isFormValid.value) return
        
        loading.value = true
        error.value = ''
        
        try {
          await authService.register(name.value, email.value, password.value)
          // 회원가입 성공 후 로그인 시도
          await authService.login(email.value, password.value)
          // 로그인 성공 후 할 일 목록 페이지로 이동
          router.push('/todos')
        } catch (err) {
          console.error('Registration error:', err)
          error.value = err.response?.data?.message || '회원가입에 실패했습니다.'
        } finally {
          loading.value = false
        }
      }
      
      return {
        name,
        email,
        password,
        confirmPassword,
        agreeTerms,
        error,
        loading,
        passwordError,
        isFormValid,
        handleRegister
      }
    }
  }
  </script>