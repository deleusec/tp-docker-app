<template>
  <div class="add-todo">
    <input v-model="newTodo" @keyup.enter="add" placeholder="Ajouter une nouvelle tâche..." class="todo-input" />
    <button @click="add" class="add-button"><span>+</span> Ajouter</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '@/stores/todo'

const store = useTodoStore()
const newTodo = ref('')

const add = async () => {
  if (!newTodo.value.trim()) return
  await store.addTodo(newTodo.value)
  newTodo.value = ''
}
</script>
