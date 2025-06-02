import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as any[],
  }),
  getters: {
    completedCount: (state) => state.todos.filter(t => t.completed).length,
  },
  actions: {
    async fetchTodos() {
      const res = await axios.get(`${API_URL}/todo`)
      this.todos = res.data.map((todo: any) => ({ ...todo, isEditing: false }))
    },
    async addTodo(title: string) {
      const res = await axios.post(`${API_URL}/todo`, { title, completed: false, description: '' })
      this.todos.push({ ...res.data, isEditing: false })
    },
    async updateTodo(todo: any) {
      todo.isEditing = false
      await axios.put(`${API_URL}/todo/${todo.id}`, todo)
    },
    async deleteTodo(id: number) {
      await axios.delete(`${API_URL}/todo/${id}`)
      this.todos = this.todos.filter(t => t.id !== id)
    },
    startEditing(todo: any) {
      todo.isEditing = true
    }
  }
})