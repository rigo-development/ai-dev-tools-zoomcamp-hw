<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="theme-toggle-wrapper">
        <ThemeToggle />
      </div>
      <h1 class="title">
        <span class="gradient-text">Code</span>Interview<span class="gradient-text">Pro</span>
      </h1>
      <p class="subtitle">Real-time collaborative coding interviews with dual execution modes</p>
    </div>

    <div class="cards-container">
      <!-- Create New Room Card -->
      <div class="card create-card" @click.stop>
        <div class="card-icon">🚀</div>
        <h2>Create New Room</h2>
        <p>Start a new interview session with a unique room ID</p>
        
        <!-- Execution Mode Selector -->
        <div class="mode-selector-compact">
          <label class="mode-label">Execution Mode:</label>
          <div class="mode-options-inline">
            <div
              class="mode-option-compact"
              :class="{ active: executionMode === 'local' }"
              @click="executionMode = 'local'"
            >
              <span class="mode-icon">🌐</span>
              <span class="mode-name">Local</span>
            </div>
            <div
              class="mode-option-compact"
              :class="{ active: executionMode === 'api' }"
              @click="executionMode = 'api'"
            >
              <span class="mode-icon">☁️</span>
              <span class="mode-name">API</span>
            </div>
          </div>
          <p class="mode-description">
            {{ executionMode === 'local' 
              ? '🌐 Local: Fast, offline, JS & Python only' 
              : '☁️ API: 8 languages, requires internet' }}
          </p>
        </div>
        
        <button class="card-button" @click="createNewRoom">Create Room</button>
      </div>

      <!-- Join Existing Room Card -->
      <div class="card join-card" @click.stop>
        <div class="card-icon">🔗</div>
        <h2>Join Existing Room</h2>
        <p>Enter a room ID to join an ongoing interview</p>
        <input
          v-model="roomIdInput"
          type="text"
          placeholder="Enter Room ID"
          class="room-input"
          @keyup.enter="joinRoom"
        />
        <button class="card-button" @click="joinRoom" :disabled="!roomIdInput.trim()">
          Join Room
        </button>
      </div>
    </div>

    <div class="features-section">
      <div class="feature">
        <span class="feature-icon">💻</span>
        <span>Real-time Collaboration</span>
      </div>
      <div class="feature">
        <span class="feature-icon">🎨</span>
        <span>Syntax Highlighting</span>
      </div>
      <div class="feature">
        <span class="feature-icon">🔒</span>
        <span>Safe Execution</span>
      </div>
      <div class="feature">
        <span class="feature-icon">📤</span>
        <span>Easy Sharing</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ThemeToggle from '../components/ThemeToggle.vue';

const router = useRouter();
const roomIdInput = ref('');
const executionMode = ref<'local' | 'api'>('local');

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function createNewRoom() {
  const roomId = generateRoomId();
  router.push(`/room/${roomId}?mode=${executionMode.value}`);
}

function joinRoom() {
  if (roomIdInput.value.trim()) {
    router.push(`/room/${roomIdInput.value.trim()}?mode=${executionMode.value}`);
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%);
  color: var(--text-primary);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
}

.hero-section {
  position: relative;
  text-align: center;
  margin-bottom: 60px;
  padding-top: 60px; /* Add space for theme toggle */
  animation: fadeInDown 0.8s ease-out;
}

.theme-toggle-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;
}

.title {
  font-size: 4rem;
  font-weight: 800;
  margin: 0 0 20px 0;
  letter-spacing: -2px;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin: 0;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 380px));
  gap: 30px;
  max-width: 1200px;
  width: 100%;
  margin-bottom: 60px;
  justify-content: center;
}

.card {
  background: var(--bg-elevated);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-secondary);
  border-radius: 16px;
  padding: 30px;
  transition: all 0.3s ease;
  cursor: pointer;
  animation: fadeInUp 0.8s ease-out;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-5px);
  border-color: var(--border-hover);
  box-shadow: 0 10px 40px var(--shadow-glow);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.card h2 {
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  color: var(--text-primary);
}

.card p {
  color: var(--text-secondary);
  margin: 0 0 20px 0;
  font-size: 0.95rem;
}

.room-input {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-input);
  border: 1px solid var(--border-secondary);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 1rem;
  margin-bottom: 15px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.room-input:focus {
  outline: none;
  border-color: var(--border-focus);
}

.card-button {
  width: 100%;
  padding: 12px 24px;
  background: var(--bg-button-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-sizing: border-box;
}

.card-button:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 5px 20px var(--shadow-glow);
}

.card-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Compact Mode Selector (inside Create Room card) */
.mode-selector-compact {
  margin: 15px 0;
  text-align: left;
}

.mode-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.mode-options-inline {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.mode-option-compact {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 12px;
  background: var(--bg-input);
  border: 2px solid var(--border-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.mode-option-compact:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
}

.mode-option-compact.active {
  border-color: var(--accent-primary);
  background: rgba(102, 126, 234, 0.15);
}

.mode-icon {
  font-size: 1.5rem;
}

.mode-name {
  font-size: 0.85rem;
  font-weight: 600;
}

.mode-description {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
  padding: 8px 12px;
  background: var(--bg-input);
  border-radius: 6px;
  text-align: center;
}

.features-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  max-width: 900px;
  animation: fadeIn 1s ease-out 0.3s both;
}

.feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  color: var(--text-secondary);
}

.feature-icon {
  font-size: 1.5rem;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }

  .cards-container {
    grid-template-columns: 1fr;
  }
}
</style>
