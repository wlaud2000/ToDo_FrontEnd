<template>
  <div>
    <!-- 네비게이션 바 -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="#">할 일 관리</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" v-if="isLoggedIn">
              <router-link class="nav-link" to="/todos">할 일 목록</router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <a class="nav-link" href="#" @click.prevent="logout">로그아웃</a>
            </li>
            <li class="nav-item" v-if="!isLoggedIn">
              <router-link class="nav-link" to="/login">로그인</router-link>
            </li>
            <li class="nav-item" v-if="!isLoggedIn">
              <router-link class="nav-link" to="/register">회원가입</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    <div class="container mt-4">
      <!-- 현재 라우트에 맞는 컴포넌트가 여기에 표시됩니다 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import authService from './services/auth'

export default {
  setup() {
    const isLoggedIn = ref(false)
    
    // 로그아웃 처리
    const logout = () => {
      authService.logout()
      isLoggedIn.value = false
      // 로그인 페이지로 이동
      window.location.href = '/login'
    }
    
    // 컴포넌트 마운트 시 로그인 상태 확인
    onMounted(() => {
      isLoggedIn.value = authService.isLoggedIn()
    })
    
    return {
      isLoggedIn,
      logout
    }
  }
}
</script>