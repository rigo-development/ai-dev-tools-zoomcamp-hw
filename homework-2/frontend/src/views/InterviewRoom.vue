<template>
  <div class="room-container">
    <div class="header">
      <div class="header-left">
        <h1>Interview Room: {{ roomId }}</h1>
        <button @click="copyShareLink" class="share-btn" title="Copy share link">
          📋 {{ linkCopied ? 'Copied!' : 'Share Link' }}
        </button>
      </div>
      <div class="header-right">
        <span class="mode-indicator" :class="executionMode">
          {{ executionMode === 'local' ? '🌐 Local' : '☁️ API' }}
        </span>
        <select v-model="selectedLanguage" class="language-selector" @change="onLanguageChange">
          <option v-for="lang in availableLanguages" :key="lang.value" :value="lang.value">
            {{ lang.label }}
          </option>
        </select>
        <button @click="runCode" :disabled="executing" class="run-btn">
          {{ executing ? 'Running...' : '▶ Run Code' }}
        </button>
      </div>
    </div>
    <div class="content">
      <div class="editor-pane">
        <CodeEditor
          v-model:code="code"
          :language="selectedLanguage"
          @change="onCodeChange"
        />
      </div>
      <div class="output-pane">
        <h3>Output</h3>
        <pre>{{ output }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import CodeEditor from '../components/CodeEditor.vue';
import { socket } from '../services/socket';
import { executeLocally } from '../services/localExecutor';

const route = useRoute();
const roomId = (route.params.id as string) || 'default-room';
const executionMode = ref<'local' | 'api'>((route.query.mode as string) === 'local' ? 'local' : 'api');
const code = ref('// Start coding here\nconsole.log("Hello World");');
const output = ref('');
const executing = ref(false);
const selectedLanguage = ref('javascript');
const linkCopied = ref(false);

// Language options based on execution mode
const allLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
];

const localLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
];

const availableLanguages = computed(() => {
  return executionMode.value === 'local' ? localLanguages : allLanguages;
});

onMounted(() => {
  console.log('Mounting InterviewRoom, connecting socket...');
  socket.connect();
  socket.emit('joinRoom', roomId);

  socket.on('codeUpdate', (newCode: string) => {
    console.log('Received codeUpdate:', newCode.substring(0, 50) + '...');
    // Only update if significantly different to avoid cursor jumps if possible,
    // but for now simple replacement.
    if (newCode !== code.value) {
      code.value = newCode;
    }
  });

  socket.on('executionResult', (result: string) => {
    console.log('Received executionResult');
    output.value = result;
    executing.value = false;
  });

  socket.on('languageChange', (newLanguage: string) => {
    console.log('Received languageChange:', newLanguage);
    selectedLanguage.value = newLanguage;
  });
});

onUnmounted(() => {
  console.log('Unmounting InterviewRoom, disconnecting socket...');
  socket.off('codeUpdate');
  socket.off('executionResult');
  socket.off('languageChange');
  socket.disconnect();
});

const onCodeChange = (newCode: string) => {
  console.log('Code changed locally, emitting codeChange event');
  socket.emit('codeChange', { roomId, code: newCode });
};

const onLanguageChange = () => {
  console.log('Language changed to:', selectedLanguage.value);
  socket.emit('languageChange', { roomId, language: selectedLanguage.value });
};

const runCode = async () => {
  executing.value = true;
  output.value = 'Executing...';
  console.log('Executing code with language:', selectedLanguage.value, 'mode:', executionMode.value);
  
  if (executionMode.value === 'local') {
    // Local browser execution
    try {
      const result = await executeLocally(selectedLanguage.value, code.value);
      output.value = result;
      executing.value = false;
    } catch (error: any) {
      output.value = `Error: ${error.message}`;
      executing.value = false;
    }
  } else {
    // API execution via Piston
    socket.emit('executeCode', { roomId, language: selectedLanguage.value, code: code.value });
  }
};

const copyShareLink = () => {
  const shareUrl = window.location.href;
  navigator.clipboard.writeText(shareUrl).then(() => {
    linkCopied.value = true;
    setTimeout(() => {
      linkCopied.value = false;
    }, 2000);
  });
};
</script>

<style scoped>
.room-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #1e1e1e;
  color: #e0e0e0;
  overflow: hidden;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #252526;
  border-bottom: 1px solid #333;
  min-height: 50px;
  box-sizing: border-box;
  gap: 20px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.header h1 {
  margin: 0;
  font-size: 1.2rem;
  color: #fff;
}
.share-btn {
  padding: 6px 12px;
  background-color: #2d2d30;
  color: #e0e0e0;
  border: 1px solid #3e3e42;
  border-radius: 2px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}
.share-btn:hover {
  background-color: #3e3e42;
}
.mode-indicator {
  padding: 6px 12px;
  background-color: #2d2d30;
  border: 1px solid #3e3e42;
  border-radius: 2px;
  font-size: 13px;
  font-weight: 600;
}
.mode-indicator.local {
  background-color: rgba(102, 126, 234, 0.2);
  border-color: #667eea;
  color: #667eea;
}
.mode-indicator.api {
  background-color: rgba(118, 75, 162, 0.2);
  border-color: #764ba2;
  color: #b794f4;
}
.language-selector {
  padding: 6px 10px;
  background-color: #2d2d30;
  color: #e0e0e0;
  border: 1px solid #3e3e42;
  border-radius: 2px;
  cursor: pointer;
  font-size: 14px;
}
.language-selector:focus {
  outline: 1px solid #0e639c;
}
.run-btn {
  padding: 6px 16px;
  background-color: #0e639c;
  color: white;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}
.run-btn:hover {
  background-color: #1177bb;
}
.run-btn:disabled {
  background-color: #4d4d4d;
  cursor: not-allowed;
}
.content {
  display: flex;
  flex: 1;
  min-height: 0; /* Critical for nested flex scrolling */
}
.editor-pane {
  flex: 2;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #333;
  min-width: 0; /* Prevent flex item from overflowing */
}
.output-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  border-left: 1px solid #333;
  min-width: 0;
}
.output-pane h3 {
  margin: 0;
  padding: 10px;
  background-color: #252526;
  font-size: 0.9rem;
  text-transform: uppercase;
  border-bottom: 1px solid #333;
}
.output-pane pre {
  margin: 0;
  padding: 10px;
  overflow: auto;
  flex: 1;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  white-space: pre-wrap;
}
</style>
