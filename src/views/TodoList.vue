<template>
    <div>
      <h2 class="mb-4">내 할 일 목록</h2>
      
      <!-- 새 할 일 입력 -->
      <div class="card mb-4">
        <div class="card-body">
          <form @submit.prevent="addTodo">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="새로운 할 일을 입력하세요"
                v-model="newTodoContent"
                :disabled="loading"
              />
              <button
                class="btn btn-primary"
                type="submit"
                :disabled="!newTodoContent || loading"
              >
                추가
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- 로딩 표시 -->
      <div v-if="loading && !todos.length" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">할 일 목록을 불러오는 중입니다...</p>
      </div>
      
      <!-- 에러 메시지 -->
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      
      <!-- 할 일 목록이 비어있는 경우 -->
      <div v-if="!loading && !todos.length" class="text-center py-5">
        <p class="text-muted">등록된 할 일이 없습니다. 새로운 할 일을 추가해보세요!</p>
      </div>
      
      <!-- 할 일 목록 -->
      <div v-if="todos.length">
        <div class="list-group">
          <div v-for="todo in todos" :key="todo.id" class="list-group-item list-group-item-action">
            <div class="d-flex align-items-center">
              <!-- 체크박스 (완료 상태) -->
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  :id="'todo-' + todo.id"
                  :checked="todo.status === 'COMPLETED'"
                  @change="toggleStatus(todo)"
                  :disabled="updatingId === todo.id"
                />
              </div>
              
              <!-- 할 일 내용 (편집 모드가 아닐 때) -->
              <div v-if="editingId !== todo.id" 
                  class="ms-2 flex-grow-1" 
                  :class="{ 'text-decoration-line-through': todo.status === 'COMPLETED' }">
                {{ todo.content }}
              </div>
              
              <!-- 할 일 내용 편집 (편집 모드일 때) -->
              <div v-else class="ms-2 flex-grow-1">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    v-model="editContent"
                    @keyup.enter="updateTodoContent(todo)"
                    @keyup.esc="cancelEdit"
                  />
                  <button 
                    class="btn btn-success btn-sm" 
                    @click="updateTodoContent(todo)"
                    :disabled="!editContent">
                    저장
                  </button>
                  <button class="btn btn-secondary btn-sm" @click="cancelEdit">
                    취소
                  </button>
                </div>
              </div>
              
              <!-- 액션 버튼 -->
              <div v-if="editingId !== todo.id" class="ms-auto">
                <button
                  class="btn btn-outline-primary btn-sm me-1"
                  @click="startEdit(todo)"
                  :disabled="updatingId === todo.id"
                >
                  편집
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="deleteTodo(todo.id)"
                  :disabled="updatingId === todo.id"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 더 불러오기 버튼 -->
        <div v-if="hasNextPage" class="text-center mt-3">
          <button
            class="btn btn-outline-primary"
            @click="loadMoreTodos"
            :disabled="loadingMore"
          >
            {{ loadingMore ? '불러오는 중...' : '더 보기' }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import todoService from '../services/todo'
  
  export default {
    setup() {
      // 상태 변수들
      const todos = ref([])
      const newTodoContent = ref('')
      const loading = ref(false)
      const loadingMore = ref(false)
      const error = ref('')
      const nextCursor = ref(null)
      const hasNextPage = ref(false)
      const editingId = ref(null)
      const editContent = ref('')
      const updatingId = ref(null)
      
      // 초기 할 일 목록 로드
      const loadTodos = async () => {
        loading.value = true
        error.value = ''
        
        try {
          const result = await todoService.getTodos()
          todos.value = result.todoList || []
          nextCursor.value = result.nextCursor || null
          hasNextPage.value = !!result.nextCursor
        } catch (err) {
          console.error('할 일 목록 로딩 에러:', err)
          error.value = '할 일 목록을 불러오는 데 실패했습니다.'
        } finally {
          loading.value = false
        }
      }
      
      // 더 많은 할 일 불러오기 (페이지네이션)
      const loadMoreTodos = async () => {
        if (!nextCursor.value || loadingMore.value) return
        
        loadingMore.value = true
        
        try {
          const result = await todoService.getTodos(nextCursor.value)
          todos.value = [...todos.value, ...(result.todoList || [])]
          nextCursor.value = result.nextCursor || null
          hasNextPage.value = !!result.nextCursor
        } catch (err) {
          console.error('추가 할 일 목록 로딩 에러:', err)
          error.value = '추가 할 일을 불러오는 데 실패했습니다.'
        } finally {
          loadingMore.value = false
        }
      }
      
      // 새 할 일 추가
      const addTodo = async () => {
        if (!newTodoContent.value.trim() || loading.value) return
        
        loading.value = true
        error.value = ''
        
        try {
          const result = await todoService.createTodo(newTodoContent.value)
          todos.value.unshift(result) // 새 할 일을 목록 맨 앞에 추가
          newTodoContent.value = '' // 입력 필드 초기화
        } catch (err) {
          console.error('할 일 추가 에러:', err)
          error.value = '할 일을 추가하는 데 실패했습니다.'
        } finally {
          loading.value = false
        }
      }
      
      // 할 일 상태 토글 (완료/미완료)
      const toggleStatus = async (todo) => {
        updatingId.value = todo.id
        
        try {
          const updatedTodo = await todoService.updateTodoStatus(todo.id)
          
          // 로컬 상태 업데이트
          const index = todos.value.findIndex(t => t.id === todo.id)
          if (index !== -1) {
            todos.value[index] = updatedTodo
          }
        } catch (err) {
          console.error('할 일 상태 변경 에러:', err)
          error.value = '할 일 상태를 변경하는 데 실패했습니다.'
        } finally {
          updatingId.value = null
        }
      }
      
      // 할 일 삭제
      const deleteTodo = async (todoId) => {
        if (!confirm('정말로 이 할 일을 삭제하시겠습니까?')) return
        
        updatingId.value = todoId
        
        try {
          await todoService.deleteTodo(todoId)
          // 삭제된 할 일을 목록에서 제거
          todos.value = todos.value.filter(todo => todo.id !== todoId)
        } catch (err) {
          console.error('할 일 삭제 에러:', err)
          error.value = '할 일을 삭제하는 데 실패했습니다.'
        } finally {
          updatingId.value = null
        }
      }
      
      // 편집 모드 시작
      const startEdit = (todo) => {
        editingId.value = todo.id
        editContent.value = todo.content
      }
      
      // 편집 취소
      const cancelEdit = () => {
        editingId.value = null
        editContent.value = ''
      }
      
      // 할 일 내용 업데이트
      const updateTodoContent = async (todo) => {
        if (!editContent.value.trim() || editContent.value === todo.content) {
          cancelEdit()
          return
        }
        
        updatingId.value = todo.id
        
        try {
          const updatedTodo = await todoService.updateTodoContent(todo.id, editContent.value)
          
          // 로컬 상태 업데이트
          const index = todos.value.findIndex(t => t.id === todo.id)
          if (index !== -1) {
            todos.value[index] = updatedTodo
          }
          
          // 편집 모드 종료
          cancelEdit()
        } catch (err) {
          console.error('할 일 내용 변경 에러:', err)
          error.value = '할 일 내용을 변경하는 데 실패했습니다.'
        } finally {
          updatingId.value = null
        }
      }
      
      // 컴포넌트 마운트 시 할 일 목록 로드
      onMounted(() => {
        loadTodos()
      })
      
      return {
        todos,
        loading,
        loadingMore,
        error,
        newTodoContent,
        hasNextPage,
        editingId,
        editContent,
        updatingId,
        loadMoreTodos,
        addTodo,
        toggleStatus,
        deleteTodo,
        startEdit,
        cancelEdit,
        updateTodoContent
      }
    }
  }
  </script>