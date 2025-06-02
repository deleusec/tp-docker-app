<template>
  <div class="todos">
    <TodoItem v-for="todo in store.todos" :key="todo.id" :todo="todo" />
  </div>
</template>

<script setup lang="ts">
import { useTodoStore } from '@/stores/todo'
import TodoItem from './TodoItem.vue'
const store = useTodoStore()
</script>
