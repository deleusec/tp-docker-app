<template>
  <div id="app">
    <div class="container">
      <h1>✨ Ma Todo List ✨</h1>
      
      <div class="add-todo">
        <input 
          v-model="newTodo" 
          @keyup.enter="addTodo"
          placeholder="Ajouter une nouvelle tâche..."
          class="todo-input"
        >
        <button @click="addTodo" class="add-button">
          <span>+</span> Ajouter
        </button>
      </div>

      <div class="todos">
        <div v-for="todo in todos" :key="todo.id" class="todo-card" :class="{ 'completed': todo.completed }">
          <div class="todo-content">
            <input 
              type="checkbox" 
              v-model="todo.completed"
              @change="updateTodo(todo)"
              class="todo-checkbox"
            >
            <div class="todo-main">
              <span class="todo-title">{{ todo.title }}</span>
              <div class="todo-description">
                <textarea 
                  v-if="todo.isEditing"
                  v-model="todo.description"
                  @blur="updateTodo(todo)"
                  placeholder="Ajouter une description..."
                  class="description-input"
                ></textarea>
                <p v-else @click="startEditing(todo)" class="description-text">
                  {{ todo.description || 'Cliquez pour ajouter une description...' }}
                </p>
              </div>
            </div>
          </div>
          <button @click="deleteTodo(todo.id)" class="delete-button">
            <span>×</span>
          </button>
        </div>
      </div>

      <div class="stats" v-if="todos.length > 0">
        <p>{{ completedCount }} tâche(s) terminée(s) sur {{ todos.length }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default {
  name: 'App',
  data() {
    return {
      todos: [],
      newTodo: ''
    }
  },
  computed: {
    completedCount() {
      return this.todos.filter(todo => todo.completed).length;
    }
  },
  async mounted() {
    await this.fetchTodos();
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await axios.get(`${API_URL}/todo`);
        this.todos = response.data.map(todo => ({
          ...todo,
          isEditing: false
        }));
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    },
    async addTodo() {
      if (!this.newTodo.trim()) return;
      
      try {
        const response = await axios.post(`${API_URL}/todo`, {
          title: this.newTodo,
          completed: false,
          description: ''
        });
        this.todos.push({
          ...response.data,
          isEditing: false
        });
        this.newTodo = '';
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    },
    async updateTodo(todo) {
      try {
        todo.isEditing = false;
        await axios.put(`${API_URL}/todo/${todo.id}`, todo);
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    },
    async deleteTodo(id) {
      try {
        await axios.delete(`${API_URL}/todo/${id}`);
        this.todos = this.todos.filter(todo => todo.id !== id);
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    },
    startEditing(todo) {
      todo.isEditing = true;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  font-size: 2.5em;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.todo-input {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.todo-input:focus {
  outline: none;
  border-color: #42b983;
}

.add-button {
  padding: 12px 24px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease;
}

.add-button:hover {
  transform: translateY(-2px);
  background-color: #3aa876;
}

.todos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.todo-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 150px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  border: 1px solid rgba(0,0,0,0.1);
}

.todo-card:hover {
  transform: translateY(-5px) rotate(1deg);
  box-shadow: 0 8px 15px rgba(0,0,0,0.2);
}

.todo-card.completed {
  background: #f8f9fa;
  border: 1px dashed #42b983;
}

.todo-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
}

.todo-title {
  font-size: 18px;
  color: #2c3e50;
  padding-right: 30px;
  line-height: 1.4;
  word-break: break-word;
}

.completed .todo-title {
  text-decoration: line-through;
  color: #888;
}

.delete-button {
  background: none;
  border: none;
  color: #ff4444;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s ease;
  position: absolute;
  bottom: 15px;
  right: 15px;
}

.delete-button:hover {
  transform: scale(1.2);
}

.stats {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

@media (max-width: 600px) {
  .container {
    padding: 10px;
  }
  
  .add-todo {
    flex-direction: column;
  }
  
  .add-button {
    width: 100%;
    justify-content: center;
  }
  
  .todos {
    grid-template-columns: 1fr;
  }
  
  .todo-card {
    min-height: 120px;
  }
}

.todo-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-description {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.description-text {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.description-text:hover {
  background-color: #f5f5f5;
}

.description-input {
  width: 100%;
  min-height: 60px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
}

.description-input:focus {
  outline: none;
  border-color: #42b983;
}

.todo-card {
  min-height: 180px;
}
</style> 