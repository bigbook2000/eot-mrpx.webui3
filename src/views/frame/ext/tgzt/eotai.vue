<template>
    <div class="eo_page">
        <div class="stream-container">
    <h2>实时字符串流</h2>
    
    <div v-if="isConnecting" class="status">连接中...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>

    <ul class="message-list">
      <li v-for="(msg, idx) in messages" :key="idx">{{ msg }}</li>
    </ul>

    <div class="controls">
      <button @click="disconnect" :disabled="isConnecting">暂停</button>
      <button @click="connect" :disabled="!isConnecting && messages.length === 0">恢复</button>
    </div>
  </div>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_tgzt_eotai" }
</script>

<script lang="ts" setup>

import { ref, onMounted, onUnmounted } from 'vue'

const fetchStream = (url: string, options?: RequestInit) => {

  const messages = ref<string[]>([])
  let controller = new AbortController()
  let isStreaming = false
  const isConnecting = ref(false)
  const error = ref<string>('')
  const disconnect = () => {
    isConnecting.value = false
    error.value = ''
    stopStream()
  }
  const connect = () => {
    isConnecting.value = true
    startStream()
  }
  
  const startStream = async () => {

    controller = new AbortController()
    isStreaming = true

    try {
      const res = await fetch(url, { ...options, signal: controller.signal })
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (isStreaming) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        // 假设后端按换行符分隔字符串
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // 保留未完整的一行
        const validLines = lines.filter(l => l.trim())
        
        messages.value.push(...validLines)
        if (messages.value.length > 500) messages.value.splice(0, messages.value.length - 500)
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') console.error('Stream error:', err)
    } finally {
      isStreaming = false
    }
  }

  const stopStream = () => {
    isStreaming = false
    controller.abort()
  }

  onMounted(startStream)
  onUnmounted(stopStream)

  return { messages, isConnecting, error, disconnect, connect, stopStream, startStream }
}

const { messages, isConnecting, error, disconnect, connect } = fetchStream('http://localhost:8080/api/stream')

</script>

<style lang="scss" scoped>
</style>