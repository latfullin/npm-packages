<script setup lang="ts">
// Демо пакета с выбором версии: локальная сборка из packages/ или любой релиз с npm
import { ref, shallowRef, watch, onMounted } from 'vue';

const props = defineProps<{
  name: string;
  localVersion: string;
  loadLocal: () => Promise<unknown>;
}>();

const LOCAL = 'local';

const versions = ref<string[]>([]);
const selected = ref(LOCAL);
const lib = shallowRef<any>(null);
const loading = ref(false);
const error = ref('');
const published = ref(true);

async function fetchVersions() {
  try {
    const res = await fetch(`https://registry.npmjs.org/${props.name}`);
    if (!res.ok) {
      published.value = false;
      return;
    }
    const data = await res.json();
    versions.value = Object.keys(data.versions).reverse();
  } catch {
    published.value = false;
  }
}

async function load(version: string) {
  loading.value = true;
  error.value = '';
  try {
    lib.value =
      version === LOCAL
        ? await props.loadLocal()
        : await import(/* @vite-ignore */ `https://cdn.jsdelivr.net/npm/${props.name}@${version}/+esm`);
  } catch (e) {
    lib.value = null;
    error.value = `Не удалось загрузить ${props.name}@${version}: ${(e as Error).message}`;
  } finally {
    loading.value = false;
  }
}

watch(selected, load);

onMounted(() => {
  fetchVersions();
  load(selected.value);
});
</script>

<template>
  <div class="package-demo">
    <div class="package-demo__bar">
      <label>
        Версия
        <select v-model="selected">
          <option :value="LOCAL">локальная ({{ localVersion }})</option>
          <option v-for="v in versions" :key="v" :value="v">{{ v }}</option>
        </select>
      </label>
      <span v-if="!published" class="package-demo__note">пакет ещё не опубликован на npm</span>
    </div>

    <p v-if="loading">Загрузка…</p>
    <p v-else-if="error" class="package-demo__error">{{ error }}</p>
    <div v-else-if="lib" class="package-demo__body">
      <slot :lib="lib" :version="selected === LOCAL ? localVersion : selected" />
    </div>
  </div>
</template>

<style scoped>
.package-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
}
.package-demo__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.package-demo__bar label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}
.package-demo__bar select {
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
}
.package-demo__note {
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.package-demo__error {
  color: var(--vp-c-danger-1);
}
.package-demo__body {
  display: grid;
  gap: 12px;
}
.package-demo__body :deep(label) {
  display: grid;
  gap: 4px;
  font-weight: 500;
}
.package-demo__body :deep(input) {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}
.package-demo__body :deep(pre) {
  margin: 0;
}
</style>
