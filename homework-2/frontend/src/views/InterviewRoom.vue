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
  padding: 20px;
  box-sizing: border-box;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.run-btn {
  padding: 8px 16px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.run-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.content {
  display: flex;
  flex: 1;
  gap: 20px;
  min-height: 0; /* Important for flex child scrolling */
}
.editor-pane {
  flex: 2;
  border: 1px solid #ccc;
}
.output-pane {
  flex: 1;
  background: #1e1e1e;
  color: #fff;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
  font-family: monospace;
}
</style>
