<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { onBeforeRouteLeave } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { read_response, response_error } from "../lib/api"
import { quiz_fetch, type Question } from "../lib/quiz"

const images: Record<string, string> = {
    "Technology": "/bubbles/computer.png",
    "History": "/bubbles/history.png",
    "Pop Culture": "/bubbles/pop_culture.png",
    "Geography": "/bubbles/geography.png",
    "Science": "/bubbles/science.png"
}

const configured_category_groups: CategoryGroup[] = [
    { name: "Digital", image: "/bubbles/digital.png", categories: ["Technology"] },
    { name: "Culture", image: "/bubbles/cultural.png", categories: ["History", "Geography", "Pop Culture"] },
]

type AnsweredQuestion = Question & {
    selected: number | null
    answer: boolean
}

type CategoryGroup = {
    name: string
    image: string
    categories: string[]
}

const auth = useAuthStore()
const categories = ref<string[]>([])
const lesson_questions = ref<AnsweredQuestion[]>([])
const option_orders = ref<Map<number, number[]>>(new Map())
const in_lesson = ref(false)
const clicked_category = ref("")
const leaving_map = ref(false)
const current_category = ref("")
const current_index = ref(0)
const current_attempt_id = ref("")
const selected_group = ref<CategoryGroup | null>(null)

const is_loading = ref(true)
const is_starting = ref(false)
const is_saving = ref(false)
const error_message = ref("")

const category_groups = computed<CategoryGroup[]>(() => {
    const groups = configured_category_groups.map(group => ({
        ...group,
        categories: group.categories.filter(category => categories.value.includes(category)),
    })).filter(group => group.categories.length > 0)

    const configured = new Set(configured_category_groups.flatMap(group => group.categories))

    const other_categories = categories.value.filter(category => !configured.has(category))
    if (other_categories.length) groups.push({ name: "Other", image: "/bubbles/other.png", categories: other_categories })
    return groups
})

const available_categories = computed(() => selected_group.value?.categories ?? [])
const filtered_questions = computed(() => lesson_questions.value)
const current_question = computed(() => filtered_questions.value[current_index.value])
const correct_count = computed(() => lesson_questions.value.filter(q => q.answer && q.selected === q.correctIndex).length)
const wrong_count = computed(() => lesson_questions.value.filter(q => q.answer && q.selected !== q.correctIndex).length)
const progress_percentage = computed(() => filtered_questions.value.length ? ((current_index.value + (current_question.value?.answer ? 1 : 0)) / filtered_questions.value.length) * 100 : 0)
const user_id = computed(() => auth.user?.id ?? null)

function require_user_id(): number {
    if (!user_id.value) throw new Error("Sign in to use the quiz.")
    return user_id.value
}

async function load_categories() {
    const response = await quiz_fetch("/api/quiz/categories", require_user_id())
    const data = await read_response<string[]>(response)
    if (!response.ok) throw new Error(response_error(data, "Could not load quiz categories."))
    categories.value = data
    console.log(data)

}

onMounted(async () => {
    if (!user_id.value) {
        is_loading.value = false
        error_message.value = "Sign in to use the quiz."
        return
    }
    try {
        await load_categories()
    } catch (error) {
        error_message.value = error instanceof Error ? error.message : "Could not load the quiz."
    } finally {
        is_loading.value = false
    }
})

onMounted(() => window.addEventListener("pagehide", handle_pagehide))
onBeforeUnmount(() => {
    window.removeEventListener("pagehide", handle_pagehide)
    // void to not wait for promise
    if (current_attempt_id.value) void save_current_lesson_history(false, true)
})

onBeforeRouteLeave(async () => {
    if (current_attempt_id.value) {
        let saved = await save_current_lesson_history(false, true)
        if (!saved) saved = await save_current_lesson_history(true, true)
        if (saved) current_attempt_id.value = ""
    }
})

function handle_pagehide() {
    if (current_attempt_id.value) void save_current_lesson_history(true, true)
}

function open_group(group: CategoryGroup) {
    clicked_category.value = group.name
    window.setTimeout(() => {
        selected_group.value = group
        clicked_category.value = ""
    }, 550)
}

function close_group() {
    selected_group.value = null
}

function shuffle<T>(items: T[]): T[] {
    const result = [...items]
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const current = result[i]!
        result[i] = result[j]!
        result[j] = current
    }
    return result
}

function shuffle_options(question: Question) {
    option_orders.value.set(question.id, shuffle(question.options.map((_, index) => index)))
}

function get_shuffled_options(question: Question): string[] {
    let order = option_orders.value.get(question.id)
    if (!order) { shuffle_options(question); order = option_orders.value.get(question.id)! }
    return order.map(index => question.options[index]!)
}

function get_original_option_index(question: Question, index: number): number {
    return option_orders.value.get(question.id)?.[index] ?? index
}

async function start_lesson(category: string) {
    if (is_starting.value) return
    clicked_category.value = category
    leaving_map.value = true
    is_starting.value = true
    error_message.value = ""
    try {
        const response = await quiz_fetch("/api/quiz/questions", require_user_id(), {
            method: "POST",
            body: JSON.stringify({
                user_id: require_user_id(), category
            }),
        })

        const data = await read_response<Question[]>(response)
        if (!response.ok) throw new Error(response_error(data, "Could not load questions for this category."))
        if (!data.length) throw new Error("There are no questions in this category yet.")

        current_category.value = category
        lesson_questions.value = shuffle(data.map(question => ({ ...question, selected: null, answer: false })))
        option_orders.value.clear()
        lesson_questions.value.forEach(shuffle_options)
        current_index.value = 0
        current_attempt_id.value = crypto.randomUUID()
        window.setTimeout(() => { in_lesson.value = true; selected_group.value = null; clicked_category.value = ""; leaving_map.value = false }, 550)
    } catch (error) {
        error_message.value = error instanceof Error ? error.message : "Could not start this lesson."
        leaving_map.value = false
        clicked_category.value = ""
    } finally {
        is_starting.value = false
    }
}

async function save_current_lesson_history(keepalive = false, include_unanswered = false) {
    const answered = lesson_questions.value.filter(question => question.answer).length
    if (!current_attempt_id.value || !lesson_questions.value.length) return true
    if (!answered && !include_unanswered) return true
    is_saving.value = true

    try {
        const response = await quiz_fetch("/api/quiz/history", require_user_id(), {
            method: "PUT",
            keepalive,
            body: JSON.stringify({
                user_id: require_user_id(),
                attempt_id: current_attempt_id.value,
                category: current_category.value,
                total_questions: lesson_questions.value.length,
                correct_questions: correct_count.value,
                wrong_questions: wrong_count.value,
            }),
        })
        const saved = await read_response(response)
        if (!response.ok) throw new Error(response_error(saved, "Could not save quiz history."))
        return true
    } catch (error) {
        error_message.value = error instanceof Error ? error.message : "Could not save quiz history."
        return false
    } finally {
        is_saving.value = false
    }
}

async function select_option(index: number) {
    const question = current_question.value
    if (!question || question.answer) return
    question.selected = get_original_option_index(question, index)
    question.answer = true
    await save_current_lesson_history()
}

async function restart_lesson() {
    const previous = lesson_questions.value
    if (!await save_current_lesson_history()) return
    lesson_questions.value = shuffle(previous.map(({ id, category, questionText, options, correctIndex }) => ({ id, category, questionText, options, correctIndex, selected: null, answer: false })))
    option_orders.value.clear()
    lesson_questions.value.forEach(shuffle_options)
    current_index.value = 0
    current_attempt_id.value = crypto.randomUUID()
}

async function exit_lesson() {
    let saved = await save_current_lesson_history(false, true)
    if (!saved) saved = await save_current_lesson_history(true, true)
    if (!saved) return
    in_lesson.value = false
    selected_group.value = null
    current_index.value = 0
    current_attempt_id.value = ""
}

async function next_question() {
    if (current_index.value < filtered_questions.value.length - 1) current_index.value++
    else await exit_lesson()
}

function get_option_class(index: number) {
    const question = current_question.value
    if (!question?.answer) return ""
    const original = get_original_option_index(question, index)
    if (original === question.correctIndex) return "correct"
    if (original === question.selected) return "wrong"
    return ""
}

function get_category_image(category: string) {
    return images[category] ?? "/bubbles/undefined.png"
}

</script>

<template>
    <div class="app-root">
        <Transition name="page" mode="out-in">
            <div v-if="is_loading" key="loading" class="notice">Loading quiz...</div>
            <div v-else-if="!in_lesson" key="map" class="map-view" :class="{ leaving: leaving_map }">
                <Transition name="category" mode="out-in">
                    <div v-if="!selected_group" key="category-groups" class="category-screen animate">
                        <h1 class="title">Choose a category</h1>
                        <p class="subtitle">Select a group to get started</p>
                        <p v-if="error_message" class="error-message">{{ error_message }}</p>
                        <p v-if="!categories.length" class="subtitle">No quiz categories are available yet.</p>
                        <div v-for="(group, index) in category_groups" :key="group.name" class="bubble-item"
                            :style="{ marginLeft: index % 2 === 0 ? '0px' : '120px', animationDelay: `${index * 0.08}s` }">
                            <button class="bubble" :disabled="is_starting"
                                :class="{ clicked: clicked_category === group.name }" @click="open_group(group)"><img
                                    class="bubble-image" :src="group.image" :alt="group.name" /></button>
                            <span class="bubble-text">{{ group.name }}</span>
                        </div>
                    </div>
                    <div v-else key="category-lessons" class="category-screen animate">
                        <button class="category-back-btn" @click="close_group">Categories</button>
                        <h1 class="title">{{ selected_group.name }}</h1>
                        <p class="subtitle">Select a lesson to get started</p>
                        <p v-if="error_message" class="error-message">{{ error_message }}</p>
                        <div v-for="(category, index) in available_categories" :key="category" class="bubble-item"
                            :style="{ marginLeft: index % 2 === 0 ? '0px' : '120px', animationDelay: `${index * 0.08}s` }">
                            <button class="bubble" :disabled="is_starting"
                                :class="{ clicked: clicked_category === category }" @click="start_lesson(category)"><img
                                    class="bubble-image" :src="get_category_image(category)"
                                    :alt="category" /></button><span class="bubble-text">{{ category }}</span>
                        </div>
                        <p v-if="!available_categories.length" class="subtitle">No lessons are available in this group.
                        </p>
                    </div>
                </Transition>
            </div>
            <div v-else key="lesson" class="lesson-view">
                <header class="lesson-header">
                    <div class="progress-wrapper">
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: progress_percentage + '%' }"></div>
                        </div>
                        <div class="progress-text"><span class="question-progress">{{ current_index + 1 }}/{{
                            filtered_questions.length }}</span><span class="result correct">{{ correct_count }}
                                Correct</span><span class="result wrong">{{ wrong_count }} Wrong</span></div>
                    </div>
                </header>
                <div class="under-header"><button class="reset-btn" @click="restart_lesson">Restart</button><button
                        class="back-btn" @click="exit_lesson">Categories</button></div>
                <main v-if="current_question" class="lesson-content">
                    <Transition name="question" mode="out-in">
                        <div :key="current_question.id" class="question-card">
                            <div class="category-label">{{ current_category }}</div>
                            <h2 class="question">{{ current_question.questionText }}</h2>
                            <div class="options"><button v-for="(option, i) in get_shuffled_options(current_question)"
                                    :key="i" class="option-btn" :class="get_option_class(i)"
                                    :disabled="current_question.answer" @click="select_option(i)"><span
                                        class="letter">{{ String.fromCharCode(65 + i) }}</span><span
                                        class="option-text">{{ option }}</span></button></div>
                        </div>
                    </Transition>
                    <div v-if="current_question.answer" class="bottom-bar"><button class="continue-btn"
                            @click="next_question">{{ current_index === filtered_questions.length - 1 ? "Finish Lesson"
                                : "Continue" }}</button></div>
                    <p v-if="error_message" class="error-message">{{ error_message }}</p>
                </main>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
}

.app-root {
    width: 100%;
    min-height: 100vh;
    color: white;
    overflow-x: hidden;
    font-family: Inter, Arial, Helvetica, sans-serif;
}

.animate {
    opacity: 0;
    transform: translateY(24px);
    animation: fade_in .3s ease forwards;
}

@keyframes fade_in {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fade_away {
    to {
        opacity: 0;
        transform: translateY(-20px);
    }
}

.page-enter-active,
.page-leave-active,
.category-enter-active,
.category-leave-active,
.question-enter-active,
.question-leave-active {
    transition: opacity .28s ease, transform .28s ease;
}

.page-enter-from,
.page-leave-to,
.category-enter-from,
.category-leave-to,
.question-enter-from,
.question-leave-to {
    opacity: 0;
    transform: translateY(18px) scale(.985);
}

.page-leave-active {
    position: absolute;
    inset: 0 auto auto 0;
    width: 100%;
}

.category-screen.animate .title,
.category-screen.animate .subtitle {
    animation: fade_in .35s ease both;
}

.category-screen.animate .subtitle {
    animation-delay: .05s;
}

.map-view.leaving .title,
.map-view.leaving .subtitle,
.map-view.leaving .bubble-item {
    animation: fade_away .42s ease forwards;
}

.map-view.leaving .bubble.clicked {
    animation: bubble_jump_pop .55s cubic-bezier(.34, 1.56, .64, 1) forwards;
}

@keyframes bubble_jump_pop {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    20% {
        transform: scale(1.16) translateY(-12px);
    }

    45% {
        transform: scale(1.04) translate(28px, -16px) rotate(8deg);
    }

    100% {
        transform: scale(0) translate(180px, -80px) rotate(24deg);
        opacity: 0;
    }
}

.map-view {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    padding: 48px 20px 80px;
}

.category-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.title {
    font-size: 2.4rem;
    margin-bottom: 10px;
    text-align: center;
}

.subtitle,
.muted {
    color: #9ca3af;
    margin: 0 0 28px;
}

.category-back-btn,
.back-btn,
.reset-btn,
.text-button {
    border: 0;
    background: #303030;
    color: white;
    border-radius: 12px;
    padding: 12px 18px;
    cursor: pointer;
}

.category-back-btn {
    align-self: flex-start;
    margin-bottom: 25px;
}

.bubble {
    width: 135px;
    height: 135px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    background: linear-gradient(180deg, #454545, #303030);
    box-shadow: 0 8px 0 #252525, 0 16px 30px #0005;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform .18s;
}

.bubble:disabled {
    opacity: .65;
    cursor: wait;
}

.bubble:hover {
    transform: translateY(-5px);
}

.bubble.clicked {
    animation: pop .55s ease-in forwards;
}

@keyframes pop {
    to {
        transform: scale(0) translate(150px, -70px);
        opacity: 0;
    }
}

.bubble-image {
    width: 50%;
    height: 50%;
    object-fit: contain;
}

.bubble-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-bottom: 3%;
    animation: fade_in .35s ease both;
}

.bubble-text {
    width: 135px;
    margin-top: 10%;
    text-align: center;
    font-weight: 700;
}

.lesson-view {
    display: flex;
    width: 100%;
    flex-direction: column;
    min-height: 100vh;
}

.lesson-header {
    padding: 22px 30px;
    display: flex;
    justify-content: center;
}

.progress-wrapper {
    width: min(500px, 100%);
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: #3a3a3a;
    border-radius: 999px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #58cc02, #8af347);
    transition: width .35s ease;
}

.progress-text {
    display: flex;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    margin-top: 10px;
}

.question-progress,
.result {
    padding: 4px 10px;
    border-radius: 12px;
    background: #2b3340;
}

.correct {
    color: #6ee7a8;
}

.wrong {
    color: #ff8b8b;
}

.under-header {
    padding: 12px 30px;
    display: flex;
    justify-content: space-between;
}

.lesson-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px 20px;
}

.question-card {
    width: min(760px, 100%);
    background: #252525;
    border-radius: 26px;
    padding: 36px;
    box-shadow: 0 20px 50px #0005;
}

.category-label {
    color: #ddd;
    font-size: .95rem;
    font-weight: 700;
    margin-bottom: 16px;
}

.question {
    font-size: 1.7rem;
    line-height: 1.4;
    margin: 0 0 34px;
}

.options {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.option-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 18px 22px;
    background: #323232;
    border: 2px solid transparent;
    border-radius: 18px;
    color: white;
    cursor: pointer;
    text-align: left;
    animation: option_in .28s ease both;
    transition: transform .18s ease, border-color .18s ease, background .18s ease;
}

.option-btn:nth-child(2) {
    animation-delay: .04s;
}

.option-btn:nth-child(3) {
    animation-delay: .08s;
}

.option-btn:nth-child(4) {
    animation-delay: .12s;
}

@keyframes option_in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.option-btn:hover:not(:disabled) {
    border-color: #58cc02;
}

.option-btn:disabled {
    cursor: default;
}

.letter {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #454545;
    font-weight: bold;
}

.option-text {
    flex: 1;
}

.option-btn.correct {
    background: #58cc0238;
    border-color: #58cc02;
}

.option-btn.wrong {
    background: #ff4a4a2e;
    border-color: #ff5c5c;
}

.bottom-bar {
    margin-top: 30px;
    width: min(760px, 100%);
    animation: fade_in .25s ease both;
}

.continue-btn {
    width: 100%;
    padding: 18px;
    border: 0;
    border-radius: 18px;
    background: #303030;
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform .18s ease, background .18s ease;
}

.continue-btn:hover {
    transform: translateY(-2px);
    background: #3a3a3a;
}

.error-message {
    color: #ff8b8b;
    text-align: center;
}

.notice {
    padding: 70px 20px;
    text-align: center;
    color: #aaa;
}

@media(max-width:700px) {
    .title {
        font-size: 2rem;
    }

    .bubble {
        width: 110px;
        height: 110px;
    }

    .question-card {
        padding: 24px;
    }

    .question {
        font-size: 1.3rem;
    }

    .option-btn {
        padding: 15px;
    }
}

@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: .01ms !important;
    }
}
</style>
