<template>
  <div class="todo-images">
    <div class="image-upload">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept="image/*"
        class="hidden"
      />
      <button @click="triggerFileInput" class="upload-btn">
        <span class="material-icons">add_photo_alternate</span>
        Add Image
      </button>
    </div>

    <div v-if="todo.images?.length" class="image-slider">
      <div class="main-image-container">
        <img
          :src="todo.images[currentImageIndex]"
          :alt="`Todo image ${currentImageIndex + 1}`"
          class="main-image"
          @click="toggleFullscreen"
        />
        <div class="slider-controls">
          <button @click="previousImage" class="slider-btn" :disabled="currentImageIndex === 0">
            <span class="material-icons">chevron_left</span>
          </button>
          <button @click="nextImage" class="slider-btn" :disabled="currentImageIndex === todo.images.length - 1">
            <span class="material-icons">chevron_right</span>
          </button>
        </div>
      </div>

      <div class="thumbnails">
        <div
          v-for="(image, index) in todo.images"
          :key="index"
          class="thumbnail-container"
          :class="{ active: index === currentImageIndex }"
          @click="currentImageIndex = index"
        >
          <img :src="image" :alt="`Thumbnail ${index + 1}`" class="thumbnail" />
          <button @click.stop="deleteImage(image)" class="delete-btn">
            <span class="material-icons">delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Fullscreen view -->
    <div v-if="isFullscreen" class="fullscreen-overlay" @click="toggleFullscreen">
      <img
        :src="todo.images[currentImageIndex]"
        :alt="`Todo image ${currentImageIndex + 1}`"
        class="fullscreen-image"
      />
      <button class="close-btn" @click="toggleFullscreen">
        <span class="material-icons">close</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '../stores/todo'

const props = defineProps<{
  todo: {
    id: number;
    images: string[];
  }
}>()

const store = useTodoStore()
const fileInput = ref<HTMLInputElement | null>(null)
const currentImageIndex = ref(0)
const isFullscreen = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    const file = input.files[0]
    try {
      await store.uploadImage(props.todo.id, file)
      input.value = ''
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }
}

const deleteImage = async (imageUrl: string) => {
  const filename = imageUrl.split('/').pop()
  if (filename) {
    try {
      await store.deleteImage(props.todo.id, filename)
      if (currentImageIndex.value >= props.todo.images.length - 1) {
        currentImageIndex.value = Math.max(0, props.todo.images.length - 2)
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }
}

const nextImage = () => {
  if (currentImageIndex.value < props.todo.images.length - 1) {
    currentImageIndex.value++
  }
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}
</script>

<style scoped>
.todo-images {
  margin-top: 1rem;
}

.image-upload {
  margin-bottom: 1rem;
}

.hidden {
  display: none;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #45a049;
}

.image-slider {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.02);
}

.slider-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  transform: translateY(-50%);
}

.slider-btn {
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.slider-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.95);
}

.slider-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  scrollbar-width: thin;
}

.thumbnails::-webkit-scrollbar {
  height: 4px;
}

.thumbnails::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.thumbnail-container {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.thumbnail-container.active {
  border-color: #4CAF50;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
  opacity: 0;
}

.thumbnail-container:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background-color: rgba(255, 0, 0, 0.9);
}

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
}

.fullscreen-image {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.material-icons {
  font-size: 1.2rem;
}
</style>
