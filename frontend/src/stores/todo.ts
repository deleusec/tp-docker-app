import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  images: string[];
  isEditing: boolean;
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as Todo[],
  }),
  getters: {
    completedCount: (state) => state.todos.filter(t => t.completed).length,
  },
  actions: {
    async fetchTodos() {
      const res = await axios.get(`${API_URL}/todo`)
      this.todos = res.data.map((todo: Todo) => ({ ...todo, isEditing: false }))
    },
    async addTodo(title: string) {
      const res = await axios.post(`${API_URL}/todo`, {
        title,
        completed: false,
        description: '',
        images: []
      })
      this.todos.push({ ...res.data, isEditing: false })
    },
    async updateTodo(todo: Todo) {
      todo.isEditing = false
      await axios.put(`${API_URL}/todo/${todo.id}`, todo)
    },
    async deleteTodo(id: number) {
      await axios.delete(`${API_URL}/todo/${id}`)
      this.todos = this.todos.filter(t => t.id !== id)
    },
    async uploadImage(todoId: number, file: File) {
      const formData = new FormData()
      formData.append('image', file)

      const res = await axios.post(`${API_URL}/todo/images/${todoId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const todo = this.todos.find(t => t.id === todoId)
      if (todo) {
        todo.images = [...(todo.images || []), res.data.url]
      }

      return res.data
    },
    async deleteImage(todoId: number, filename: string) {
      await axios.delete(`${API_URL}/todo/images/${todoId}/${filename}`)

      const todo = this.todos.find(t => t.id === todoId)
      if (todo) {
        todo.images = todo.images.filter(url => !url.includes(filename))
      }
    },
    startEditing(todo: Todo) {
      todo.isEditing = true
    }
  }
})
