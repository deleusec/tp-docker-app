<template>
  <div class="todo-card" :class="{ completed: todo.completed }">
    <div class="todo-content">
      <input type="checkbox" v-model="todo.completed" @change="update" class="todo-checkbox" />
      <div class="todo-main">
        <span class="todo-title">{{ todo.title }}</span>
        <div class="todo-description">
          <textarea v-if="todo.isEditing" v-model="todo.description" @blur="update" class="description-input"></textarea>
          <p v-else @click="edit" class="description-text">
            {{ todo.description || 'Cliquez pour ajouter une description...' }}
          </p>
        </div>
      </div>
    </div>
    <button @click="del" class="delete-button"><span>×</span></button>
  </div>
</template>

<script setup lang="ts">
import { useTodoStore } from '@/stores/todo'
const props = defineProps<{ todo: any }>()
const store = useTodoStore()
const update = () => store.updateTodo(props.todo)
const del = () => store.deleteTodo(props.todo.id)
const edit = () => store.startEditing(props.todo)
</script>
