<script setup lang="ts">
import { ref, computed } from "vue"
import { RouterLink, useRoute } from "vue-router"
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    ArrowRight,
    Check
} from "lucide-vue-next"
import { useAuthStore } from "../stores/auth"
import { router } from "../router"
import { api_fetch, read_response, response_error } from "../lib/api"

const auth = useAuthStore();
const route = useRoute();

const mode = ref<"login" | "register">("login")
const show_password = ref(false)
const show_confirm_password = ref(false)
const remember_me = ref(false)
const is_loading = ref(false)

const name = ref("")
const email = ref("")
const password = ref("")
const confirm_password = ref("")

const submitted = ref(false)
const status_message = ref(route.query.notice === "password-updated" ? "Your password was changed. Sign in again with your new password." : "")

const errors = ref({
    name: "",
    email: "",
    password: "",
    confirm_password: ""
})

function validate_name() {
    if (mode.value !== "register") {
        errors.value.name = ""
        return true
    }

    const value = name.value.trim()

    if (!value) {
        errors.value.name = "Please enter your name."
        return false
    }

    if (value.length <= 3) {
        errors.value.name = "Your name must be more than 3 characters."
        return false
    }

    return true
}

function validate_email() {
    const value = email.value.trim()

    if (!value) {
        errors.value.email = "Please enter your e-mail address."
        return false
    }

    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email_pattern.test(value)) {
        errors.value.email = "Please enter a valid e-mail address."
        return false
    }

    return true
}

function validate_password() {
    if (!password.value) {
        errors.value.password = "Please enter your password."
        return false
    }

    if (password.value.length < 8) {
        errors.value.password = "Your password must be at least 8 characters."
        return false
    }

    return true
}

function validate_confirm_password() {
    if (mode.value !== "register") {
        errors.value.confirm_password = ""
        return true
    }

    if (!confirm_password.value) {
        errors.value.confirm_password = "Please confirm your password."
        return false
    }

    if (password.value !== confirm_password.value) {
        errors.value.confirm_password = "Passwords do not match."
        return false
    }

    return true
}

function validate_form() {
    const name_valid = validate_name()
    const email_valid = validate_email()
    const password_valid = validate_password()
    const confirm_password_valid = validate_confirm_password()

    return (
        name_valid &&
        email_valid &&
        password_valid &&
        confirm_password_valid
    )
}

const can_submit = computed(() => {
    if (mode.value === "register") {
        return (
            name.value.trim().length > 3 &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) &&
            password.value.length >= 8 &&
            confirm_password.value.length > 0 &&
            password.value === confirm_password.value
        )
    }

    return (
        email.value.trim().length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) &&
        password.value.length >= 8
    )
})

function clear_error(field: keyof typeof errors.value) {
    errors.value[field] = ""
}

async function resend_verification() {
    if (is_loading.value) return
    if (!email.value.trim()) {
        errors.value.email = "Enter your e-mail address first."
        return
    }
    is_loading.value = true
    try {
        const response = await api_fetch("/email/verification/resend", {
            method: "POST",
            body: JSON.stringify({ email: email.value.trim() }),
        })
        const data = await read_response(response)
        if (!response.ok) throw new Error(response_error(data, "Could not request a verification e-mail."))
        status_message.value = response_error(data, "If verification is needed, an e-mail has been sent.")
        errors.value.email = ""
    } catch (error) {
        errors.value.email = error instanceof Error ? error.message : "Could not request a verification e-mail."
    } finally {
        is_loading.value = false
    }
}

function handle_name_input() {
    if (submitted.value) {
        validate_name()
    } else {
        clear_error("name")
    }
}

function handle_email_input() {
    if (submitted.value) {
        validate_email()
    } else {
        clear_error("email")
    }
}

function handle_password_input() {
    if (submitted.value) {
        validate_password()

        if (
            mode.value === "register" &&
            confirm_password.value
        ) {
            validate_confirm_password()
        }
    } else {
        clear_error("password")
        clear_error("confirm_password")
    }
}

function handle_confirm_password_input() {
    if (submitted.value) {
        validate_confirm_password()
    } else {
        clear_error("confirm_password")
    }
}

async function submit() {
    submitted.value = true

    const valid = validate_form()

    if (!valid || is_loading.value) {
        return
    }

    is_loading.value = true

    try {
        if (mode.value === "register") {
            const response = await api_fetch("/register", {
                method: "POST",
                body: JSON.stringify({
                    username: name.value.trim(),
                    email: email.value.trim(),
                    password: password.value
                })
            })

            const data = await read_response(response)

            if (!response.ok) {
                throw new Error(response_error(data, "Registration failed."))
            }

            switch_mode("login")
            status_message.value = "Account created. Check your e-mail for a verification link before signing in."
            name.value = ""

            return
        }

        const body = {
            email: email.value.trim(),
            password: password.value,
            remember_me: remember_me.value
        }

        const response = await api_fetch("/login_email", {
            method: "POST",
            body: JSON.stringify(body)
        })

        const data = await read_response(response)

        if (!response.ok) {
            throw new Error(response_error(data, "Login failed."))
        }

        auth.sign_in(data as { access_token: string; refresh_token: string; expires_at?: string }, remember_me.value)

        if (!await auth.check_auth()) {
            auth.clear_session()
            throw new Error("Signed in, but your session could not be loaded. Please try again.")
        }
        router.replace("/")

    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Something went wrong."

        errors.value.email = message
    } finally {
        is_loading.value = false
    }
}

function switch_mode(new_mode: "login" | "register") {
    mode.value = new_mode
    status_message.value = ""
    password.value = ""
    confirm_password.value = ""
    show_password.value = false
    show_confirm_password.value = false
    submitted.value = false

    errors.value = {
        name: "",
        email: "",
        password: "",
        confirm_password: ""
    }
}
</script>

<template>
    <main class="auth-page animate">
        <div class="auth-layout">
            <section class="auth-intro">
                <RouterLink to="/" class="logo">
                    GOPHER AUTH
                </RouterLink>

                <div class="intro-content">
                    <span class="eyebrow">WELCOME</span>

                    <h1>
                        Some fancy text here,
                        <span>and fancier text.</span>
                    </h1>

                    <p>
                        Sign in to access your account, do this,
                        do that, and enjoy a more personalized experience.
                    </p>
                </div>

                <div class="intro-footer">
                    <span>Your privacy matters</span>
                </div>
            </section>

            <section class="auth-card">
                <div class="auth-header">
                    <span class="eyebrow">
                        {{ mode === "login" ? "ACCOUNT" : "GET STARTED" }}
                    </span>

                    <h2>
                        {{
                            mode === "login"
                                ? "Welcome back"
                                : "Create your account"
                        }}
                    </h2>

                    <p>
                        {{
                            mode === "login"
                                ? "Enter your details to continue."
                                : "Create an account to get started."
                        }}
                    </p>
                </div>

                <div class="mode-switch">
                    <button :class="{ active: mode === 'login' }" type="button" @click="switch_mode('login')">
                        Sign in
                    </button>

                    <button :class="{ active: mode === 'register' }" type="button" @click="switch_mode('register')">
                        Create account
                    </button>
                </div>

                <form novalidate @submit.prevent="submit">
                    <p v-if="status_message" class="success-message" role="status">{{ status_message }}</p>
                    <div v-if="mode === 'register'" class="form-group">
                        <label for="name">
                            Username
                        </label>

                        <div class="input-wrapper" :class="{ 'has-error': errors.name }">
                            <User :size="17" />

                            <input id="name" v-model="name" type="text" placeholder="Your username" autocomplete="name"
                                @input="handle_name_input" />
                        </div>

                        <span v-if="errors.name" class="error">
                            {{ errors.name }}
                        </span>
                    </div>

                    <div class="form-group">
                        <label for="email">
                            E-mail address
                        </label>

                        <div class="input-wrapper" :class="{ 'has-error': errors.email }">
                            <Mail :size="17" />

                            <input id="email" v-model="email" type="email" placeholder="you@example.com"
                                autocomplete="email" @input="handle_email_input" />
                        </div>

                        <span v-if="errors.email" class="error">
                            {{ errors.email }}
                        </span>
                        <button v-if="mode === 'login'" class="resend-link" type="button" :disabled="is_loading"
                            @click="resend_verification">
                            Resend verification email
                        </button>
                    </div>

                    <div class="form-group">
                        <label for="password">
                            Password
                        </label>

                        <div class="input-wrapper" :class="{ 'has-error': errors.password }">
                            <Lock :size="17" />

                            <input id="password" v-model="password" :type="show_password ? 'text' : 'password'"
                                placeholder="Enter your password" :autocomplete="mode === 'login'
                                    ? 'current-password'
                                    : 'new-password'
                                    " @input="handle_password_input" />

                            <button type="button" class="visibility-button" :aria-label="show_password
                                ? 'Hide password'
                                : 'Show password'
                                " @click="show_password = !show_password">
                                <EyeOff v-if="show_password" :size="17" />

                                <Eye v-else :size="17" />
                            </button>
                        </div>

                        <span v-if="errors.password" class="error">
                            {{ errors.password }}
                        </span>
                    </div>

                    <div v-if="mode === 'register'" class="form-group">
                        <label for="confirm-password">
                            Confirm password
                        </label>

                        <div class="input-wrapper" :class="{
                            'has-error': errors.confirm_password
                        }">
                            <Lock :size="17" />

                            <input id="confirm-password" v-model="confirm_password" :type="show_confirm_password
                                ? 'text'
                                : 'password'
                                " placeholder="Confirm your password" autocomplete="new-password"
                                @input="handle_confirm_password_input" />

                            <button type="button" class="visibility-button" :aria-label="show_confirm_password
                                ? 'Hide password'
                                : 'Show password'
                                " @click="
                                    show_confirm_password =
                                    !show_confirm_password
                                    ">
                                <EyeOff v-if="show_confirm_password" :size="17" />

                                <Eye v-else :size="17" />
                            </button>
                        </div>

                        <span v-if="errors.confirm_password" class="error">
                            {{ errors.confirm_password }}
                        </span>
                    </div>

                    <div v-if="mode === 'login'" class="form-options">
                        <label class="remember">
                            <input v-model="remember_me" type="checkbox" />

                            <span class="checkbox">
                                <Check :size="12" />
                            </span>

                            <span>Remember me</span>
                        </label>

                        <RouterLink to="/forgot_password" class="forgot-link">
                            Forgot password?
                        </RouterLink>
                    </div>

                    <button type="submit" class="submit-button" :disabled="!can_submit || is_loading">
                        <span v-if="!is_loading">
                            {{
                                mode === "login"
                                    ? "Sign in"
                                    : "Create account"
                            }}
                        </span>

                        <span v-else class="loading-content">
                            <span class="spinner"></span>

                            {{
                                mode === "login"
                                    ? "Signing in..."
                                    : "Creating account..."
                            }}
                        </span>

                        <ArrowRight v-if="!is_loading" :size="17" />
                    </button>
                </form>

                <p class="terms">
                    By continuing, you agree to our
                    <RouterLink to="/terms">
                        Terms
                    </RouterLink>
                    and
                    <RouterLink to="/privacy">
                        Privacy Policy
                    </RouterLink>.
                </p>
            </section>
        </div>
    </main>
</template>

<style scoped>
.auth-page {
    min-height: calc(100vh - 70px);
    display: flex;
    align-items: center;
    padding: 50px 20px;
    color: #fff;
}

.animate {
    opacity: 0;
    transform: translateY(30px);
    animation: fade_in 0.2s forwards;
}

.legal-page.animate {
    animation-delay: 0.2s;
}

@keyframes fade_in {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.auth-layout {
    display: grid;
    grid-template-columns: 1fr 480px;
    width: 100%;
    max-width: 1050px;
    min-height: 680px;
    margin: auto;
    overflow: hidden;
    border: 1px solid #292929;
    border-radius: 18px;
    background: #161616;
}

.auth-intro {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 45px;
    background: #131313;

}

.logo {
    color: #fff;
    text-decoration: none;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.16em;
}

.intro-content {
    max-width: 470px;
}

.eyebrow {
    display: block;
    margin-bottom: 12px;
    color: #666;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.15em;
}

.intro-content h1 {
    margin: 0;
    font-size: 54px;
    line-height: 1.04;
    letter-spacing: -0.045em;
}

.intro-content h1 span {
    color: #777;
}

.intro-content p {
    max-width: 410px;
    margin: 25px 0 0;
    color: #888;
    font-size: 15px;
    line-height: 1.8;
}

.intro-footer {
    display: flex;
    gap: 9px;
    color: #555;
    font-size: 11px;
}

.auth-card {
    padding: 45px 40px;
    background: #131313;
}

.mobile-logo {
    display: none;
}

.auth-header {
    margin-bottom: 25px;
}

.auth-header h2 {
    margin: 0;
    color: #fff;
    font-size: 28px;
    letter-spacing: -0.025em;
}

.auth-header p {
    margin: 9px 0 0;
    color: #777;
    font-size: 13px;
}

.mode-switch {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    padding: 4px;
    margin-bottom: 25px;
    border-radius: 9px;
    background: #1c1c1c;
}

.mode-switch button {
    border: 0;
    border-radius: 7px;
    padding: 10px;
    background: transparent;
    color: #666;
    cursor: pointer;
    font: inherit;
    font-size: 12px;
    transition: 0.2s ease;
}

.mode-switch button.active {
    background: #292929;
    color: #fff;
}

.form-group {
    margin-bottom: 17px;
}

.form-group label {
    display: block;
    margin-bottom: 7px;
    color: #aaa;
    font-size: 12px;
    font-weight: 500;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-wrapper>svg {
    position: absolute;
    left: 13px;
    color: #555;
    pointer-events: none;
}

.input-wrapper input {
    width: 100%;
    box-sizing: border-box;
    height: 45px;
    padding: 0 42px;
    border: 1px solid #2b2b2b;
    border-radius: 8px;
    outline: none;
    background: #191919;
    color: #fff;
    font: inherit;
    font-size: 13px;
    transition: border-color 0.2s ease;
}

.input-wrapper input::placeholder {
    color: #555;
}

.input-wrapper input:focus {
    border-color: #505050;
}

.visibility-button {
    position: absolute;
    right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 0;
    background: transparent;
    color: #666;
    cursor: pointer;
}

.visibility-button:hover {
    color: #aaa;
}

.error {
    display: block;
    margin-top: 6px;
    color: #c87878;
    font-size: 11px;
}

.success-message {
    margin: 0 0 16px;
    color: #91ad91;
    font-size: 12px;
    line-height: 1.5;
}

.resend-link {
    display: block;
    margin-top: 7px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #ddd;
    font: inherit;
    font-size: 11px;
    text-decoration: underline;
    cursor: pointer;
}

.form-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 4px 0 20px;
}

.remember {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #777;
    cursor: pointer;
    font-size: 11px;
}

.remember input {
    display: none;
}

.checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
    border: 1px solid #383838;
    border-radius: 4px;
    color: transparent;
}

.remember input:checked+.checkbox {
    background: #fff;
    border-color: #fff;
    color: #111;
}

.forgot-link {
    color: #888;
    font-size: 11px;
    text-decoration: none;
}

.forgot-link:hover {
    color: #fff;
}

.submit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 46px;
    border: 0;
    border-radius: 8px;
    background: #fff;
    color: #111;
    cursor: pointer;
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    transition: 0.2s ease;
}

.submit-button:hover:not(:disabled) {
    background: #e7e7e7;
}

.submit-button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.loading-content {
    display: flex;
    align-items: center;
    gap: 9px;
}

.spinner {
    width: 13px;
    height: 13px;
    border: 2px solid #bbb;
    border-top-color: #111;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

.divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 25px 0 17px;
    color: #555;
    font-size: 10px;
}

.divider::before,
.divider::after {
    flex: 1;
    height: 1px;
    content: "";
    background: #282828;
}

.social-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px;
}

.social-buttons button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 42px;
    border: 1px solid #2c2c2c;
    border-radius: 8px;
    background: #191919;
    color: #aaa;
    cursor: pointer;
    font: inherit;
    font-size: 12px;
}

.social-buttons button:hover {
    border-color: #444;
    color: #fff;
}

.social-icon {
    color: #ddd;
    font-weight: 700;
}

.terms {
    margin: 22px 0 0;
    color: #555;
    font-size: 10px;
    line-height: 1.7;
    text-align: center;
}

.terms a {
    color: #888;
    text-decoration: none;
}

.terms a:hover {
    color: #fff;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 850px) {
    .auth-page {
        padding: 30px 15px;
    }

    .auth-layout {
        grid-template-columns: 1fr;
        max-width: 480px;
        min-height: auto;
    }

    .auth-intro {
        display: none;
    }

    .mobile-logo {
        display: block;
        margin-bottom: 35px;
    }
}

@media (max-width: 500px) {
    .auth-page {
        min-height: 100vh;
        padding: 0;
    }

    .auth-layout {
        min-height: 100vh;
        border: 0;
        border-radius: 0;
    }

    .auth-card {
        padding: 35px 20px;
    }

    .auth-header h2 {
        font-size: 25px;
    }

    .social-buttons {
        grid-template-columns: 1fr;
    }
}
</style>
