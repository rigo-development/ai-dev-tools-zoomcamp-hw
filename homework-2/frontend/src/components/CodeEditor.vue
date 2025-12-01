<template>
  <div class="editor-container">
    <vue-monaco-editor
      v-model:value="localCode"
      :language="language"
      theme="vs-dark"
      :options="editorOptions"
      @mount="handleMount"
      @change="handleChange"
      class="editor"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from 'vue';
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';

const props = defineProps<{
  code: string;
  language: string;
}>();

const emit = defineEmits(['update:code', 'change']);

const { code } = toRefs(props);
const localCode = ref(code.value);

const editorOptions = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  minimap: { enabled: false },
};

// Sync prop changes to local state (remote updates)
watch(code, (newVal) => {
  if (newVal !== localCode.value) {
    localCode.value = newVal;
  }
});

const handleChange = (val: string) => {
  emit('update:code', val);
  emit('change', val);
};

const handleMount = (editor: any) => {
  console.log('Editor mounted');
};
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.editor {
    width: 100%;
    height: 100%;
}
</style>
