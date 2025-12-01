<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="title">
        <span class="gradient-text">Code</span>Interview<span class="gradient-text">Pro</span>
      </h1>
      <p class="subtitle">Real-time collaborative coding interviews with dual execution modes</p>
    </div>

    <div class="cards-container">
      <!-- Create New Room Card -->
      <div class="card create-card" @click="createNewRoom">
        <div class="card-icon">🚀</div>
        <h2>Create New Room</h2>
        <p>Start a new interview session with a unique room ID</p>
        <button class="card-button">Create Room</button>
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

      <!-- Execution Mode Card -->
      <div class="card mode-card">
        <div class="card-icon">⚡</div>
        <h2>Execution Mode</h2>
        <p>Choose how code will be executed</p>
        
        <div class="mode-selector">
          <div
            class="mode-option"
            :class="{ active: executionMode === 'local' }"
            @click="executionMode = 'local'"
          >
            <div class="mode-header">
              <span class="mode-title">🌐 Local (Browser)</span>
              <span class="mode-badge">Fast</span>
            </div>
            <ul class="mode-features">
              <li>✓ Instant execution</li>
              <li>✓ Works offline</li>
              <li>⚠ JavaScript & Python only</li>
            </ul>
          </div>

          <div
            class="mode-option"
            :class="{ active: executionMode === 'api' }"
            @click="executionMode = 'api'"
          >
            <div class="mode-header">
              <span class="mode-title">☁️ API (Piston)</span>
              <span class="mode-badge">8 Languages</span>
            </div>
            <ul class="mode-features">
              <li>✓ 8 programming languages</li>
              <li>✓ Secure sandboxed execution</li>
              <li>⚠ Requires internet</li>
            </ul>
          </div>
        </div>
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

const router = useRouter();
const roomIdInput = ref('');
const executionMode = ref<'local' | 'api'>('api');

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
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d30 100%);
  color: #e0e0e0;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-section {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInDown 0.8s ease-out;
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
  color: #b0b0b0;
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
  background: rgba(45, 45, 48, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.card h2 {
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  color: #fff;
}

.card p {
  color: #b0b0b0;
  margin: 0 0 20px 0;
  font-size: 0.95rem;
}

.room-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 1rem;
  margin-bottom: 15px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.room-input:focus {
  outline: none;
  border-color: #667eea;
}

.card-button {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.card-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mode-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mode-option {
  background: rgba(30, 30, 30, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.mode-option:hover {
  border-color: rgba(102, 126, 234, 0.5);
}

.mode-option.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.mode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.mode-title {
  font-weight: 600;
  font-size: 1rem;
}

.mode-badge {
  background: rgba(102, 126, 234, 0.3);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.mode-features {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
  color: #b0b0b0;
}

.mode-features li {
  padding: 4px 0;
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
  color: #b0b0b0;
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
