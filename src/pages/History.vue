<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useAuthStore } from "../stores/auth"
import { read_response, response_error } from "../lib/api"
import { quiz_fetch } from "../lib/quiz"
import type { LessonHistory } from "../lib/history"

const auth = useAuthStore()
const history = ref<LessonHistory[]>([])
const is_loading = ref(true)
const is_clearing = ref(false)
const error_message = ref("")

function format_date(timestamp: string | null) {
    if (!timestamp) return "Previous attempt"
    const date = new Date(timestamp)
    return Number.isNaN(date.getTime()) ? "Previous attempt" : date.toLocaleString(undefined, {
        year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
    })
}

function calculate_score(correct: number, total: number) {
    return total === 0 ? 0 : Math.round((correct / total) * 100)
}

async function load_history() {
    if (!auth.user?.id) {
        error_message.value = "Sign in to view your quiz history."
        is_loading.value = false
        return
    }
    try {
        /* Ignore this, just testing rate limiting */
        /* for (let i = 0; i < 30; i++) {
            const response = await quiz_fetch("/api/quiz/history", auth.user.id)
            const data = await read_response<LessonHistory[]>(response)
            if (!response.ok) throw new Error(response_error(data, "Could not load your history."))
            history.value = data
        } */

        const response = await quiz_fetch("/api/quiz/history", auth.user.id)
        const data = await read_response<LessonHistory[]>(response)
        if (!response.ok) throw new Error(response_error(data, "Could not load your history."))
        history.value = data
    } catch (error) {
        error_message.value = error instanceof Error ? error.message : "Could not load your history."
    } finally {
        is_loading.value = false
    }
}

async function reset_history() {
    if (!history.value.length || !window.confirm("Delete all history?")) return
    is_clearing.value = true
    error_message.value = ""
    try {
        const response = await quiz_fetch("/api/quiz/history", auth.user!.id, { method: "DELETE" })
        if (!response.ok) {
            const data = await read_response(response)
            throw new Error(response_error(data, "Could not clear your history."))
        }
        history.value = []
    } catch (error) {
        error_message.value = error instanceof Error ? error.message : "Could not clear your history."
    } finally {
        is_clearing.value = false
    }
}

onMounted(load_history)
</script>

<template>
    <div class="history-page animate">
        <header class="history-header animate">
            <h1>Quiz History</h1>
            <button v-if="history.length" class="reset-history-btn" :disabled="is_clearing" @click="reset_history">
                {{ is_clearing ? "Clearing…" : "Reset History" }}
            </button>
        </header>

        <p v-if="is_loading" class="empty">Loading history…</p>
        <p v-else-if="error_message" class="error">{{ error_message }}</p>
        <div v-else-if="history.length === 0" class="empty">History is empty.</div>

        <article v-for="(lesson, index) in history" :key="lesson.id" class="history-card"
            :style="{ animationDelay: `${index * 0.08}s` }">
            <h2>{{ lesson.category }}</h2>
            <div class="stats">
                <span class="score">{{ lesson.totalQuestions }} Questions</span>
                <span class="correct">{{ lesson.correctQuestions }} Correct</span>
                <span class="wrong">{{ lesson.wrongQuestions }} Incorrect</span>
                <span class="unanswered">{{ Math.max(0, lesson.totalQuestions - lesson.correctQuestions -
                    lesson.wrongQuestions) }} Unanswered</span>
                <span class="percentage">{{ calculate_score(lesson.correctQuestions, lesson.totalQuestions) }}%</span>
            </div>
            <small>{{ format_date(lesson.timestamp) }}</small>
        </article>
    </div>
</template>

<style scoped>
.history-page,
.history-card,
.history-header,
.reset-history-btn {
    box-sizing: border-box;
}

.history-page {
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    padding: 40px 20px;
    color: white;
}

.animate {
    opacity: 0;
    transform: translateY(30px);
    animation: fade_in .2s forwards;
}

.history-page.animate {
    animation-delay: .2s;
}

@keyframes fade_in {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    width: min(760px, 100%);
    margin: 0 auto 35px;
}

.history-header h1 {
    margin: 0;
    font-size: 1.8rem;
}

.reset-history-btn {
    border: none;
    background: #303030;
    color: white;
    padding: 12px 18px;
    border-radius: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 5px 0 #202020;
    transition: transform .15s, background .15s;
}

.reset-history-btn:hover:not(:disabled) {
    background: #3b3b3b;
}

.reset-history-btn:active:not(:disabled) {
    transform: translateY(4px);
    box-shadow: none;
}

.reset-history-btn:disabled {
    opacity: .6;
    cursor: wait;
}

.history-card {
    width: min(760px, 100%);
    max-width: 100%;
    margin: 0 auto 18px;
    background: #252525;
    border-radius: 22px;
    padding: 24px;
    box-shadow: 0 15px 35px #0005;
}

.history-card h2 {
    margin: 0 0 14px;
    font-size: 1.4rem;
}

.stats {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 12px;
}

.score,
.correct,
.wrong,
.unanswered,
.percentage {
    padding: 6px 12px;
    border-radius: 12px;
    background: #2b3340;
    font-size: .9rem;
    white-space: nowrap;
}

.percentage {
    color: #8af347;
    font-weight: 700;
}

.correct {
    color: #6ee7a8;
}

.wrong {
    color: #ff8b8b;
}

.unanswered {
    color: #d1d5db;
}

.history-card small {
    color: #9ca3af;
}

.empty,
.error {
    text-align: center;
    color: #aaa;
}

.error {
    color: #ff8b8b;
}

@media(max-width:700px) {
    .history-page {
        padding: 30px 15px;
    }

    .history-card {
        padding: 20px;
        border-radius: 18px;
    }

    .history-card h2 {
        font-size: 1.25rem;
    }

    .stats {
        gap: 8px;
    }

    .score,
    .correct,
    .wrong,
    .unanswered,
    .percentage {
        font-size: .85rem;
        padding: 5px 10px;
    }
}

@media(max-width:430px) {
    .history-page {
        padding: 20px 12px;
    }

    .history-header {
        margin-bottom: 20px;
    }

    .history-header h1 {
        font-size: 1.45rem;
    }

    .reset-history-btn {
        padding: 11px;
    }

    .history-card {
        padding: 16px;
        border-radius: 16px;
    }

    .history-card h2 {
        font-size: 1.15rem;
        margin-bottom: 12px;
    }

    .stats {
        flex-direction: column;
        align-items: stretch;
    }

    .score,
    .correct,
    .wrong,
    .unanswered,
    .percentage {
        width: 100%;
        text-align: center;
    }

    .history-card small {
        display: block;
        margin-top: 10px;
        font-size: .8rem;
    }
}
</style>
