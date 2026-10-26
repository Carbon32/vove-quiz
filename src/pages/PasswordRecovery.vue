<script setup lang="ts">
import { computed, ref } from "vue"
import { useRoute } from "vue-router"
import { api_fetch, read_response, response_error } from "../lib/api"

const route = useRoute()
const is_reset = computed(() => route.path === "/reset_password")
const email = ref("")
const token = ref(typeof route.query.token === "string" ? route.query.token : "")
const password = ref("")
const confirmation = ref("")
const loading = ref(false)
const message = ref("")
const error = ref("")

async function submit_form() {
    error.value = ""
    message.value = ""
    if (is_reset.value && password.value !== confirmation.value) {
        error.value = "The passwords do not match."
        return
    }
    loading.value = true
    try {
        const response = await api_fetch(is_reset.value ? "/password/reset" : "/password/forgot", {
            method: "POST",
            body: JSON.stringify(is_reset.value
                ? { token: token.value, new_password: password.value }
                : { email: email.value.trim() }),
        })
        const data = await read_response(response)
        if (!response.ok) throw new Error(response_error(data, "Could not process your request."))
        message.value = response_error(data, is_reset.value ? "Password updated. You can sign in now." : "If that account exists, a reset link has been sent.")
        if (is_reset.value) {
            password.value = ""
            confirmation.value = ""
        }
    } catch (cause) {
        error.value = cause instanceof Error ? cause.message : "Could not connect to the server."
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <main class="recovery-page animate">
        <section class="recovery-card">
            <span class="eyebrow">ACCOUNT SECURITY</span>
            <h1>{{ is_reset ? "Choose a new password" : "Reset your password" }}</h1>
            <p>{{ is_reset ? "Choose a new password with at least 8 characters." :
                "Enter your account e-mail. If it matches an account, we'll send a one-time reset link." }}</p>
            <form v-if="!message" @submit.prevent="submit_form">
                <label v-if="!is_reset">E-mail address<input v-model="email" type="email" autocomplete="email"
                        required /></label>
                <template v-else>
                    <p v-if="!token" class="error">This reset link is missing its token. Request another reset link.</p>
                    <label>New password<input v-model="password" type="password" autocomplete="new-password"
                            minlength="8" maxlength="72" required /></label>
                    <label>Confirm new password<input v-model="confirmation" type="password" autocomplete="new-password"
                            minlength="8" maxlength="72" required /></label>
                </template>
                <p v-if="error" class="error" role="alert">{{ error }}</p>
                <button class="action-button" type="submit" :disabled="loading || (is_reset && !token)">{{ loading ?
                    "Please wait..." :
                    (is_reset ? "Update password" : "Send reset link") }}</button>
            </form>
            <p v-if="message" class="success" role="status">{{ message }}</p>
            <RouterLink class="action-link" to="/auth">Back to sign in</RouterLink>
        </section>
    </main>
</template>

<style scoped>
.recovery-page {
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

.recovery-page.animate {
    animation-delay: 0.2s;
}

.recovery-card {
    width: min(460px, 100%);
    padding: 36px;
    border: 1px solid #303030;
    border-radius: 14px;
    background: #151515;
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

label {
    display: block;
    margin: 18px 0;
    color: #aaa;
    font-size: 13px;
}

input {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 42px;
    margin-top: 7px;
    padding: 0 11px;
    border: 1px solid #383838;
    border-radius: 7px;
    outline: none;
    background: #1d1d1d;
    color: #fff;
    font: inherit;
}

input:focus {
    border-color: #777;
}

.error {
    color: #d78383;
}

.success {
    color: #91ad91;
}

.action-button {
    width: 100%;
    min-height: 42px;
    margin-top: 7px;
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
    cursor: not-allowed;
}

.action-link {
    display: inline-block;
    margin-top: 18px;
    color: #ddd;
}
</style>
