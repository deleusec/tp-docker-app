<script setup lang="ts">
import { onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import TodoInput from '@/components/TodoInput.vue'
import TodoList from '@/components/TodoList.vue'

const store = useTodoStore()
onMounted(() => store.fetchTodos())
</script>

<template>
  <main>
    <TodoInput />
    <TodoList />
    <div class="stats" v-if="store.todos.length > 0">
      <p>{{ store.completedCount }} tâche(s) terminée(s) sur {{ store.todos.length }}</p>
    </div>
  </main>
</template>

