<template>
  <div class="room-container">
    <div class="header">
      <h1>Interview Room: {{ roomId }}</h1>
      <button @click="runCode" :disabled="executing" class="run-btn">
        {{ executing ? 'Running...' : 'Run Code' }}
      </button>
    </div>
    <div class="content">
      <div class="editor-pane">
        <CodeEditor
          v-model:code="code"
          language="javascript"
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import CodeEditor from '../components/CodeEditor.vue';
import { socket } from '../services/socket';

const route = useRoute();
const roomId = (route.params.id as string) || 'default-room';
const code = ref('// Start coding here\nconsole.log("Hello World");');
const output = ref('');
const executing = ref(false);

onMounted(() => {
  socket.connect();
  socket.emit('joinRoom', roomId);

  socket.on('codeUpdate', (newCode: string) => {
    // Only update if significantly different to avoid cursor jumps if possible,
    // but for now simple replacement.
    if (newCode !== code.value) {
      code.value = newCode;
    }
  });

  socket.on('executionResult', (result: string) => {
    output.value = result;
    executing.value = false;
  });
});

onUnmounted(() => {
  socket.off('codeUpdate');
  socket.off('executionResult');
  socket.disconnect();
});

const onCodeChange = (newCode: string) => {
  socket.emit('codeChange', { roomId, code: newCode });
};

const runCode = () => {
  executing.value = true;
  output.value = 'Executing...';
  socket.emit('executeCode', { roomId, language: 'javascript', code: code.value });
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
  height: 50px;
  box-sizing: border-box;
}
.header h1 {
  margin: 0;
  font-size: 1.2rem;
  color: #fff;
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
