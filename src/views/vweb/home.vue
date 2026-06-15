<template>
    <div class="eo_page">
        <div class="eo_row">
            <div class="eo_row_f">
                <div class="eo_col">
                    <!-- AI响应输出 -->
                    <div class="eo_col_f chat-container">
                        <div class="chat-messages">
                            <!-- 系统欢迎消息 -->
                            <div class="message ai-message" v-if="messages.length === 0">
                                <div class="message-content">
                                    <div class="message-text">你好！我是你的AI助手，有什么问题可以问我。</div>
                                </div>
                            </div>
                            
                            <!-- 聊天消息列表 -->
                            <div v-for="(msg, idx) in messages" 
                                :key="idx"
                                :class="['message', msg.type === 'user' ? 'user-message' : 'ai-message']">
                                <div class="message-content">
                                    <div class="message-text">{{ msg.content }}</div>
                                </div>
                            </div>
                            
                            <!-- 正在输入提示 -->
                            <div v-if="isStreaming && !currentAiMessage" class="message ai-message typing-indicator">
                                <div class="message-content">
                                    <div class="typing-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 输入 -->
                    <div class="eo_col_d">
                        <div class="div_send_border">
                            <div class="input-wrapper">
                                <el-input type="textarea"
                                    :rows="2" :autosize="{ minRows: 2, maxRows: 6 }"
                                    v-model="x_input_send" 
                                    placeholder="输入问题，我来帮你解答..."
                                    @keydown.enter.ctrl="onButtonClick_send">
                                </el-input>
                                <div class="input-hint">Ctrl + Enter 发送</div>
                            </div>
                            <div class="button">
                                <el-button type="default" :icon="Plus" circle
                                    @click="onButtonClick_clear"
                                    :disabled="isStreaming">
                                </el-button>
                                <el-button type="danger" :icon="Close" circle
                                    @click="onButtonClick_stop"
                                    :disabled="!isStreaming">
                                </el-button>
                                <el-button type="primary" :icon="Top" circle
                                    @click="onButtonClick_send"
                                    :disabled="!x_input_send.trim() || isStreaming">
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="eo_row_d" style="width: 400px;background-color: #f5f5f5;">
                <div class="side-panel">
                    <!-- 历史对话 -->
                    <div class="history-section">
                        <div class="section-header">
                            <span class="section-title">历史对话</span>
                        </div>
                        <div class="history-list">
                            <div v-for="(item, idx) in recentHistory" 
                                :key="'history-' + idx"
                                class="history-item"
                                @click="x_input_send = item.question">
                                <div class="history-content">{{ item.question }}</div>
                                <div class="history-actions">
                                    <span 
                                        class="action-btn"
                                        :class="{ 'active': item.isFavorite }"
                                        @click.stop="toggleFavorite(item)">
                                        {{ item.isFavorite ? '★' : '☆' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 收藏对话 -->
                    <div class="favorite-section">
                        <div class="section-header">
                            <span class="section-title">收藏对话</span>
                        </div>
                        <div class="favorite-list">
                            <div v-for="(item, idx) in favoriteHistory" 
                                :key="'favorite-' + idx"
                                class="favorite-item"
                                @click="x_input_send = item.question">
                                <div class="favorite-content">{{ item.question }}</div>
                                <div class="favorite-actions">
                                    <span class="action-btn remove-btn" @click.stop="removeFavorite(item)">×</span>
                                </div>
                            </div>
                            <div v-if="favoriteHistory.length === 0" class="empty-state">
                                暂无收藏
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "home" }
</script>

<script lang="ts" setup>

import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { Plus, Top, Close } from '@element-plus/icons-vue'

import eocore from "@/inc/eocore";
import TGlobal from "@/logic/TGlobal";
import TLogic from "@/logic/TLogic";

interface ChatMessage {
    type: 'user' | 'ai';
    content: string;
}

interface HistoryItem {
    question: string;
    isFavorite: boolean;
    timestamp: number;
}

const x_input_send = ref<string>("");
const messages = ref<ChatMessage[]>([])
let controller = new AbortController()
let isStreaming = ref(false);
let currentAiMessage = ref<string>("");

    let messageAll = "";

// 历史对话数据
const history = ref<HistoryItem[]>([
    { question: 'EOTMRPX智能企业管理平台对中小企业有什么帮助？', isFavorite: true, timestamp: Date.now() - 10800000 },
    { question: '根据最近一个月库存情况分析企业整体经营情况', isFavorite: true, timestamp: Date.now() - 10800000 },
])

// 最近历史对话（不包含收藏）
const recentHistory = computed(() => {
    return history.value
        .filter(item => !item.isFavorite)
        .sort((a, b) => b.timestamp - a.timestamp);
})

// 收藏对话
const favoriteHistory = computed(() => {
    return history.value
        .filter(item => item.isFavorite)
        .sort((a, b) => b.timestamp - a.timestamp);
})

const onButtonClick_send = () => {
    const msg = x_input_send.value.trim();
    if (msg === "") return;
    if (isStreaming.value) return;
    
    // 添加用户消息
    messages.value.push({
        type: 'user',
        content: msg
    });
    
    x_input_send.value = "";
    startStream(msg);
}

const onButtonClick_clear = () => {
    messageAll = "";
    messages.value = [];
    currentAiMessage.value = "";
    isStreaming.value = false;
}

const onButtonClick_stop = () => {
    stopStream();
}

const scrollToBottom = async () => {
    await nextTick();
    const container = document.querySelector('.chat-messages');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

const startStream = async (question: string) => {
    controller = new AbortController()
    isStreaming.value = true
    currentAiMessage.value = "";

    try {
        const dt = new Date();
        const data = {
            _d: 0,
            _s: "",
            _k: eocore.token,
            _t: dt.getTime(),
            _list: [{
                // 合并历史对话和当前问题
                message: messageAll + question
            }]
        }

        const res = await fetch(eocore.base_url + "/project/chat/stream", { 
            method: "POST", 
            body: JSON.stringify(data), 
            headers: {
                'Content-Type': 'application/json',
                "Authorization": eocore.token
            },
            signal: controller.signal 
        })

        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let aiMessage: ChatMessage | null = null;
        let buffer = '';

        while (isStreaming.value) {
            const ret = await reader.read();
            //console.log(ret);
            
            if (ret.done) { 
                // 处理剩余的buffer内容
                if (buffer && aiMessage) {
                    currentAiMessage.value += buffer;
                    aiMessage.content = currentAiMessage.value;
                    await scrollToBottom();
                }
                
                // 保存到历史
                if (currentAiMessage.value) {
                    saveToHistory(question);
                    messageAll += "用户提问:" + question + "\r\nAI回答:" + currentAiMessage.value + "\r\n";
                }
                break;
            }

            // 解码当前数据块
            buffer += decoder.decode(ret.value, { stream: true });
            
            // 逐字符显示，实现打字机效果
            while (buffer.length > 0 && isStreaming.value) {
                // 首次收到数据时创建AI消息
                if (!aiMessage) {
                    aiMessage = {
                        type: 'ai',
                        content: ''
                    };
                    messages.value.push(aiMessage);
                }

                // 每次只取一个字符
                const char = buffer.charAt(0);
                buffer = buffer.slice(1);
                
                currentAiMessage.value += char;
                aiMessage.content = currentAiMessage.value;
                
                await scrollToBottom();
                
                // 添加微小延迟，控制打字速度
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
    } catch (err: any) {
        console.error('Stream error:', err);
        if (err.name !== 'AbortError') {            
            messages.value.push({
                type: 'ai',
                content: '抱歉，发生了错误，请稍后重试。'
            });
        }
    } finally {
        isStreaming.value = false;
        await scrollToBottom();
    }
}

const saveToHistory = (question: string) => {
    // 检查是否已存在相同问题
    const existingIndex = history.value.findIndex(h => h.question === question);
    if (existingIndex >= 0) {
        history.value[existingIndex].timestamp = Date.now();
    } else {
        history.value.push({
            question,
            isFavorite: false,
            timestamp: Date.now()
        });
    }
}

const toggleFavorite = (item: HistoryItem) => {
    item.isFavorite = !item.isFavorite;
}

const removeFavorite = (item: HistoryItem) => {
    item.isFavorite = false;
}

const stopStream = () => {
    isStreaming.value = false
    controller.abort()
}

onMounted(() => {
})
onUnmounted(() => {
    stopStream();
})

</script>

<style lang="scss" scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }
}

.message {
    max-width: 90%;
    
    &.user-message {
        align-self: flex-end;
        
        .message-content {
            text-align: right;
        }
    }
    
    &.ai-message {
        align-self: flex-start;
    }
}

.message-content {
    padding: 8px 12px;
}

.message-text {
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-all;
}

.user-message .message-text {
    color: #409eff;
}

.ai-message .message-text {
    color: #333;
}

.typing-indicator {
    .typing-dots {
        display: flex;
        gap: 4px;
        padding: 8px 0;
        
        span {
            width: 8px;
            height: 8px;
            background-color: #999;
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
            
            &:nth-child(1) { animation-delay: 0s; }
            &:nth-child(2) { animation-delay: 0.2s; }
            &:nth-child(3) { animation-delay: 0.4s; }
        }
    }
}

@keyframes typing {
    0%, 60%, 100% {
        transform: scale(0.6);
        opacity: 0.5;
    }
    30% {
        transform: scale(1);
        opacity: 1;
    }
}

.div_send_border {
    padding: 16px 20px;
    box-sizing: border-box;
    border-top: 1px solid #e4e7ed;
    background-color: #fff;
}

.input-wrapper {
    position: relative;
    
    :deep(.el-textarea__inner) {
        border: 1px solid #dcdfe6;
        border-radius: 12px;
        padding: 12px 16px;
        font-size: 14px;
        resize: none;
        transition: border-color 0.2s;
        
        &:focus {
            border-color: #409eff;
            outline: none;
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
        }
    }
    
    .input-hint {
        position: absolute;
        right: 12px;
        bottom: 12px;
        font-size: 12px;
        color: #999;
    }
}

.button {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
    gap: 8px;
}

/* 右侧面板样式 */
.side-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.history-section,
.favorite-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.history-section {
    border-bottom: 1px solid #e4e7ed;
}

.section-header {
    padding: 12px 16px;
    border-bottom: 1px solid #e4e7ed;
    background-color: #fff;
}

.section-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.history-list,
.favorite-list {
    flex: 1;
    padding: 8px;
    overflow: hidden;
}

.history-item,
.favorite-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    margin-bottom: 4px;
    background-color: #fff;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: #f5f7fa;
    }
}

.history-content,
.favorite-content {
    flex: 1;
    font-size: 13px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.history-actions,
.favorite-actions {
    margin-left: 8px;
}

.action-btn {
    font-size: 16px;
    color: #ccc;
    cursor: pointer;
    transition: color 0.2s;
    
    &:hover,
    &.active {
        color: #ffd700;
    }
    
    &.remove-btn {
        font-size: 20px;
        color: #999;
        
        &:hover {
            color: #f56c6c;
        }
    }
}

.empty-state {
    text-align: center;
    padding: 20px;
    color: #999;
    font-size: 13px;
}
</style>