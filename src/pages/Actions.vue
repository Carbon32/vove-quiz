<script setup lang="ts">
import { computed, ref } from "vue"
import { useRoute } from "vue-router"
import { api_fetch, read_response, response_error } from "../lib/api"

const route = useRoute()
const token = typeof route.query.token === "string" ? route.query.token : ""
const is_email_change = computed(() => route.path === "/confirm_email")
const title = computed(() => is_email_change.value ? "Confirm your new e-mail" : "Verify your e-mail")
const endpoint = computed(() => is_email_change.value ? "/email/change/confirm" : "/verify_email")
const loading = ref(false)
const message = ref("")
const error = ref("")

async function confirm_action() {
    if (!token || loading.value) return
    loading.value = true
    error.value = ""
    try {
        const response = await api_fetch(endpoint.value, {
            method: "POST",
            body: JSON.stringify({ token }),
        })
        const data = await read_response(response)
        if (!response.ok) throw new Error(response_error(data, "This link is invalid or has expired."))
        message.value = response_error(data, is_email_change.value ? "E-mail address updated." : "E-mail verified.")
    } catch (cause) {
        error.value = cause instanceof Error ? cause.message : "Could not confirm this link."
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <main class="action-page animate">
        <section class="action-card" aria-labelledby="action-title">
            <span class="eyebrow">ACCOUNT SECURITY</span>
            <h1 id="action-title">{{ title }}</h1>
            <p v-if="message" class="success" role="status">{{ message }}</p>
            <p v-else-if="error" class="error" role="alert">{{ error }}</p>
            <p v-else-if="!token" class="error" role="alert">This link is missing its token. Request a new link and try
                again.</p>
            <p v-else>For your security, confirm this one-time link to continue.</p>
            <button v-if="token && !message" class="action-button" type="button" :disabled="loading"
                @click="confirm_action">
                {{ loading ? "Confirming..." : (is_email_change ? "Confirm e-mail change" : "Verify email") }}
            </button>
            <RouterLink v-if="message" class="action-link" to="/auth">Continue to sign in</RouterLink>
        </section>
    </main>
</template>

<style scoped>
.action-page {
    min-height: calc(100vh - 140px);
    display: grid;
    place-items: center;
    padding: 32px 16px;
    color: #eee;
}

.animate {
    opacity: 0;
    transform: translateY(30px);
    animation: fade_in 0.2s forwards;
}

@keyframes fade_in {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.action-page.animate {
    animation-delay: 0.2s;
}

.action-card {
    width: min(480px, 100%);
    padding: 36px;
    border: 1px solid #303030;
    border-radius: 14px;
    background: #151515;
    text-align: center;
}

.eyebrow {
    color: #777;
    font-size: 10px;
    letter-spacing: .16em;
}

h1 {
    margin: 12px 0;
    font-size: 26px;
}

p {
    color: #999;
    line-height: 1.6;
}

.error {
    color: #d78383;
}

.success {
    color: #91ad91;
}

.action-button {
    min-height: 42px;
    padding: 0 18px;
    border: 0;
    border-radius: 7px;
    background: #eee;
    color: #111;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
}

.action-button:disabled {
    opacity: .6;
    cursor: wait;
}

.action-link {
    display: inline-block;
    margin-top: 16px;
    color: #eee;
}
</style>
