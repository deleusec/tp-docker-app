<template>
  <div class="todo-card" :class="{ completed: todo.completed }">
    <div class="todo-content">
      <div class="todo-main">
        <div class="todo-header">
          <div class="todo-left">
            <input type="checkbox" v-model="todo.completed" @change="update" class="todo-checkbox" />
            <h3 class="todo-title">{{ todo.title }}</h3>
            <span class="status-label">{{ todo.completed ? 'Terminé' : 'En cours' }}</span>
          </div>
          <button @click="del" class="delete-button" title="Supprimer la tâche">
            <span class="material-icons">delete</span>
          </button>
        </div>
        <div class="todo-description">
          <textarea
            v-if="todo.isEditing"
            v-model="todo.description"
            @blur="update"
            class="description-input"
            placeholder="Ajouter une description..."
            rows="3"
          ></textarea>
          <p v-else @click="edit" class="description-text" :class="{ empty: !todo.description }">
            <span class="material-icons description-icon">description</span>
            {{ todo.description || 'Cliquez pour ajouter une description...' }}
          </p>
        </div>
        <div class="todo-images-section">
          <TodoImageUpload :todo="todo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTodoStore } from '@/stores/todo'
import TodoImageUpload from './TodoImageUpload.vue'

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  images: string[];
  isEditing: boolean;
}

const props = defineProps<{ todo: Todo }>()
const store = useTodoStore()
const update = () => store.updateTodo(props.todo)
const del = () => store.deleteTodo(props.todo.id)
const edit = () => store.startEditing(props.todo)
</script>

<style scoped>
.todo-card {
  background: var(--color-background);
  border-radius: var(--radius-xl);
  padding: var(--spacing-3xl);
  margin-bottom: var(--spacing-3xl);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-smooth);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
}

.todo-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--color-primary);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.todo-card:hover::before {
  opacity: 1;
}

.todo-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-xl);
}

.todo-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.todo-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.todo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
  gap: var(--spacing-lg);
}

.todo-left {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 0;
}

.todo-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--line-height-tight);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-weight: 500;
  white-space: nowrap;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-background-light);
  border-radius: var(--radius-sm);
}

.todo-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  padding-top: 2px;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  position: relative;
  transition: all var(--transition-smooth);
  background-color: var(--color-background);
  flex-shrink: 0;
}

.todo-checkbox:checked {
  background-color: var(--color-primary);
}

.todo-checkbox:checked::after {
  content: '✓';
  position: absolute;
  color: var(--color-background);
  font-size: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.todo-checkbox:hover {
  border-color: var(--color-primary-hover);
  transform: scale(1.1);
}

.todo-description {
  margin-top: var(--spacing-sm);
  position: relative;
}

.description-text {
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  background-color: var(--color-background-light);
  transition: all var(--transition-fast);
  min-height: 1.5rem;
  line-height: var(--line-height-loose);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.description-icon {
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.description-text.empty {
  color: var(--color-text-muted);
  font-style: italic;
}

.description-text:hover {
  background-color: var(--color-background-hover);
  transform: translateY(-1px);
}

.description-input {
  width: 100%;
  padding: var(--spacing-lg);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all var(--transition-fast);
  background-color: var(--color-background);
}

.description-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.delete-button {
  background: none;
  border: none;
  color: var(--color-danger);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  width: 36px;
  height: 36px;
}

.delete-button:hover {
  background-color: var(--color-danger-hover);
  opacity: 1;
  transform: scale(1.1) rotate(5deg);
}

.todo-images-section {
  margin-top: var(--spacing-sm);
  border-top: 2px solid var(--color-background-hover);
  padding-top: var(--spacing-lg);
}

.completed {
  opacity: 0.85;
  background-color: var(--color-background-light);
}

.completed .todo-title {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.completed .todo-checkbox {
  border-color: var(--color-text-muted);
  background-color: var(--color-text-muted);
}

.completed .status-label {
  color: var(--color-text-muted);
}

.material-icons {
  font-size: var(--font-size-lg);
}

@media (max-width: 600px) {
  .todo-card {
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
  }

  .todo-title {
    font-size: var(--font-size-md);
  }

  .description-input {
    min-height: 80px;
    padding: var(--spacing-md);
  }

  .description-text {
    padding: var(--spacing-md);
  }

  .todo-header {
    margin-bottom: var(--spacing-xs);
  }
}
</style>
