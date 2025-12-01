<template>
  <button 
    @click="toggleTheme" 
    class="theme-toggle"
    :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`"
    :title="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`"
  >
    <span class="theme-icon">{{ theme === 'dark' ? '☀️' : '🌙' }}</span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme';

const { theme, toggleTheme } = useTheme();
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background-color: var(--bg-button-hover);
  border-color: var(--border-hover);
  transform: scale(1.05);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-icon {
  font-size: 1.2rem;
  line-height: 1;
  transition: transform 0.3s ease;
}

.theme-toggle:hover .theme-icon {
  transform: rotate(20deg);
}
</style>
