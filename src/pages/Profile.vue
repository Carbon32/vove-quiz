<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import {
    User,
    Mail,
    Lock,
    ShieldCheck,
    CalendarDays,
    Save,
    LogOut,
    Check,
    Clock
} from "lucide-vue-next"
import { useAuthStore } from "../stores/auth"
import { api_fetch, get_access_token, get_session_expiry, read_response, response_error } from "../lib/api"

interface Profile {
    id: number
    first_name: string
    last_name: string
    username: string
    email: string
    created_at: string
    verified: boolean
}

const auth = useAuthStore()
const router = useRouter()

const profile = ref<Profile | null>(null)

const is_loading = ref(true)
const is_saving_profile = ref(false)
const is_saving_email = ref(false)
const is_saving_password = ref(false)

const profile_message = ref("")
const profile_error = ref("")
const email_message = ref("")
const email_error = ref("")
const password_message = ref("")
const password_error = ref("")

const first_name = ref("")
const last_name = ref("")
const username = ref("")
const new_email = ref("")
const email_password = ref("")
const current_password = ref("")
const new_password = ref("")
const confirm_password = ref("")

const days_remaining = ref<number | null>(null)
const session_expires_at = ref<Date | null>(null)

async function load_profile() {
    const token = get_access_token()

    if (!token) {
        router.push("/auth")
        return
    }

    try {
        const response = await api_fetch("/user/profile")

        if (response.status === 401) {
            auth.logout()
            router.push("/auth")
            return
        }

        const data = await read_response<Profile>(response)

        if (!response.ok) {
            throw new Error(
                typeof data === "string"
                    ? data
                    : response_error(data, "Could not load your profile.")
            )
        }

        profile.value = data

        first_name.value = data.first_name
        last_name.value = data.last_name
        username.value = data.username
        new_email.value = data.email
    } catch (error) {
        profile_error.value =
            error instanceof Error
                ? error.message
                : "Could not load your profile."
    } finally {
        is_loading.value = false
    }
}

function get_token_expiration() {
    const expires_at = get_session_expiry()

    if (!expires_at) {
        session_expires_at.value = null
        days_remaining.value = null
        return
    }

    try {
        session_expires_at.value = new Date(expires_at)
        if (Number.isNaN(session_expires_at.value.getTime())) throw new Error("Invalid session expiry")

        const milliseconds_left =
            session_expires_at.value.getTime() - Date.now()

        days_remaining.value = Math.max(
            0,
            Math.ceil(
                milliseconds_left /
                (1000 * 60 * 60 * 24)
            )
        )
    } catch (error) {
        console.error(
            "Could not read token expiration:",
            error
        )

        session_expires_at.value = null
        days_remaining.value = null
    }
}

async function update_profile() {
    profile_message.value = ""
    profile_error.value = ""

    if (!first_name.value.trim()) {
        profile_error.value = "Please enter your first name."
        return
    }

    if (!last_name.value.trim()) {
        profile_error.value = "Please enter your last name."
        return
    }

    if (!username.value.trim()) {
        profile_error.value = "Please enter your username."
        return
    }

    is_saving_profile.value = true

    try {
        const response = await api_fetch("/user/update_profile", {
            method: "PUT",
            body: JSON.stringify({
                first_name: first_name.value.trim(),
                last_name: last_name.value.trim(),
                username: username.value.trim()
            })
        })

        const data = await read_response(response)

        if (!response.ok) {
            throw new Error(
                typeof data === "string"
                    ? data
                    : response_error(data, "Could not update your profile.")
            )
        }

        profile_message.value =
            typeof data === "string"
                ? data
                : "Information updated."

        if (profile.value) {
            profile.value.first_name = first_name.value.trim()
            profile.value.last_name = last_name.value.trim()
            profile.value.username = username.value.trim()

            auth.set_user({
                id: profile.value.id,
                first_name: profile.value.first_name,
                last_name: profile.value.last_name,
                username: profile.value.username,
                email: profile.value.email
            })
        }
    } catch (error) {
        profile_error.value =
            error instanceof Error
                ? error.message
                : "Could not update your profile."
    } finally {
        is_saving_profile.value = false
    }
}

async function update_email() {
    email_message.value = ""
    email_error.value = ""

    if (!new_email.value.trim()) {
        email_error.value = "Please enter your new e-mail address."
        return
    }

    if (!email_password.value) {
        email_error.value = "Please enter your current password."
        return
    }

    is_saving_email.value = true

    try {
        const response = await api_fetch("/user/update_email", {
            method: "PUT",
            body: JSON.stringify({
                email: new_email.value.trim(),
                password: email_password.value
            })
        })

        const data = await read_response(response)

        if (!response.ok) {
            throw new Error(
                typeof data === "string"
                    ? data
                    : response_error(data, "Could not update your e-mail.")
            )
        }

        email_message.value = typeof data === "string" ? data : response_error(data, "Check your inbox to confirm the new e-mail.")

        email_password.value = ""
    } catch (error) {
        email_error.value =
            error instanceof Error
                ? error.message
                : "Could not update your e-mail."
    } finally {
        is_saving_email.value = false
    }
}

async function update_password() {
    password_message.value = ""
    password_error.value = ""

    if (!current_password.value) {
        password_error.value = "Please enter your current password."
        return
    }

    if (new_password.value.length < 8) {
        password_error.value =
            "Your new password must be at least 8 characters."
        return
    }

    if (new_password.value !== confirm_password.value) {
        password_error.value = "Passwords do not match."
        return
    }

    is_saving_password.value = true

    try {
        const response = await api_fetch("/user/update_password", {
            method: "PUT",
            body: JSON.stringify({
                password: current_password.value,
                new_password: new_password.value
            })
        })

        const data = await read_response(response)

        if (!response.ok) {
            throw new Error(
                typeof data === "string"
                    ? data
                    : response_error(data, "Could not update your password.")
            )
        }

        password_message.value = "Password changed. Sign in again with your new password."

        current_password.value = ""
        new_password.value = ""
        confirm_password.value = ""
        auth.clear_session()
        router.replace({ path: "/auth", query: { notice: "password-updated" } })
    } catch (error) {
        password_error.value =
            error instanceof Error
                ? error.message
                : "Could not update your password."
    } finally {
        is_saving_password.value = false
    }
}

async function logout() {
    await auth.logout()
    router.replace("/auth")
}

function format_date(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    })
}

onMounted(() => {
    load_profile()
    get_token_expiration()
})
</script>

<template>
    <main class="profile-page">
        <div class="profile-container animate">

            <div v-if="is_loading" class="loading">
                Loading profile...
            </div>

            <template v-else-if="profile">
                <header class="profile-top">
                    <div class="identity">
                        <div class="avatar">
                            {{ profile.username.charAt(0).toUpperCase() }}
                        </div>

                        <div class="identity-info">
                            <span class="eyebrow">
                                YOUR ACCOUNT
                            </span>

                            <h1>
                                {{ profile.first_name }}
                                {{ profile.last_name }}
                            </h1>

                            <p>
                                @{{ profile.username }}
                            </p>
                        </div>
                    </div>

                    <div class="header-right">
                        <div class="account-status">
                            <span class="status" :class="{ verified: profile.verified }">
                                <ShieldCheck :size="14" />

                                {{
                                    profile.verified
                                        ? "Verified account"
                                        : "Unverified account"
                                }}
                            </span>

                            <span class="member-since">
                                <CalendarDays :size="13" />

                                Since {{ format_date(profile.created_at) }}
                            </span>

                            <span v-if="days_remaining !== null" class="session-status">
                                <Clock :size="13" />

                                <span>
                                    Session expires in
                                    <strong>
                                        {{ days_remaining }}
                                        {{ days_remaining === 1 ? "day" : "days" }}
                                    </strong>
                                </span>
                            </span>

                        </div>

                        <button class="logout-button" type="button" @click="logout">
                            <LogOut :size="15" />
                            Sign out
                        </button>
                    </div>
                </header>

                <div class="settings-layout">
                    <section class="settings-section">
                        <div class="section-title">
                            <div class="section-icon">
                                <User :size="16" />
                            </div>

                            <div>
                                <h2>Personal information</h2>
                                <p>Basic information about you.</p>
                            </div>
                        </div>

                        <form @submit.prevent="update_profile">
                            <div class="fields">
                                <div class="field">
                                    <label for="first-name">
                                        First name
                                    </label>

                                    <input id="first-name" v-model="first_name" type="text" autocomplete="given-name" />
                                </div>

                                <div class="field">
                                    <label for="last-name">
                                        Last name
                                    </label>

                                    <input id="last-name" v-model="last_name" type="text" autocomplete="family-name" />
                                </div>

                            </div>

                            <div class="field">
                                <label for="username">
                                    Username
                                </label>

                                <input id="username" v-model="username" type="text" autocomplete="username" />
                            </div>

                            <p v-if="profile_error" class="error">
                                {{ profile_error }}
                            </p>

                            <p v-if="profile_message" class="success">
                                <Check :size="13" />
                                {{ profile_message }}
                            </p>

                            <button class="save-button" type="submit" :disabled="is_saving_profile">
                                <Save :size="14" />

                                {{
                                    is_saving_profile
                                        ? "Saving..."
                                        : "Save changes"
                                }}
                            </button>
                        </form>
                    </section>

                    <section class="settings-section">
                        <div class="section-title">
                            <div class="section-icon">
                                <Mail :size="16" />
                            </div>

                            <div>
                                <h2>E-mail address</h2>
                                <p>Manage your login e-mail.</p>
                            </div>
                        </div>

                        <form @submit.prevent="update_email">
                            <div class="field">
                                <label for="email">
                                    E-mail address
                                </label>

                                <input id="email" v-model="new_email" type="email" autocomplete="email" />
                            </div>

                            <div class="field">
                                <label for="email-password">
                                    Current password
                                </label>

                                <input id="email-password" v-model="email_password" type="password"
                                    autocomplete="current-password" placeholder="Confirm your password" />
                            </div>

                            <p v-if="email_error" class="error">
                                {{ email_error }}
                            </p>

                            <p v-if="email_message" class="success">
                                <Check :size="13" />
                                {{ email_message }}
                            </p>

                            <button class="save-button" type="submit" :disabled="is_saving_email">
                                <Save :size="14" />

                                {{
                                    is_saving_email
                                        ? "Saving..."
                                        : "Update e-mail"
                                }}
                            </button>

                        </form>
                    </section>

                    <section class="settings-section password-section">
                        <div class="section-title">
                            <div class="section-icon">
                                <Lock :size="16" />
                            </div>

                            <div>
                                <h2>Password</h2>
                                <p>Keep your account secure.</p>
                            </div>
                        </div>

                        <form @submit.prevent="update_password">
                            <div class="field">
                                <label for="current-password">
                                    Current password
                                </label>

                                <input id="current-password" v-model="current_password" type="password"
                                    autocomplete="current-password" />
                            </div>

                            <div class="fields">
                                <div class="field">
                                    <label for="new-password">
                                        New password
                                    </label>

                                    <input id="new-password" v-model="new_password" type="password"
                                        autocomplete="new-password" />
                                </div>

                                <div class="field">
                                    <label for="confirm-password">
                                        Confirm password
                                    </label>

                                    <input id="confirm-password" v-model="confirm_password" type="password"
                                        autocomplete="new-password" />
                                </div>
                            </div>

                            <p v-if="password_error" class="error">
                                {{ password_error }}
                            </p>

                            <p v-if="password_message" class="success">
                                <Check :size="13" />
                                {{ password_message }}
                            </p>

                            <button class="save-button" type="submit" :disabled="is_saving_password">
                                <Save :size="14" />

                                {{
                                    is_saving_password
                                        ? "Saving..."
                                        : "Change password"
                                }}
                            </button>
                        </form>
                    </section>
                </div>
            </template>
            <div v-else class="error-page">
                {{ profile_error || "Could not load your profile." }}
            </div>

        </div>
    </main>
</template>

<style scoped>
.profile-page {
    min-height: calc(100vh - 70px);
    padding: 48px 20px 80px;
    color: #fff;
}

.profile-container {
    width: min(1000px, 100%);
    margin: 0 auto;
}

.animate {
    opacity: 0;
    transform: translateY(30px);
    animation: fade_in 0.2s forwards;
}

.profile-container.animate {
    animation-delay: 0.2s;
}

@keyframes fade_in {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.profile-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 35px;
    padding: 0 0 30px;
    border-bottom: 1px solid #292929;
}

.identity {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
}

.avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    border: 1px solid #303030;
    border-radius: 15px;
    background: #1a1a1a;
    color: #aaa;
    font-size: 20px;
    font-weight: 600;
}

.identity-info {
    min-width: 0;
}

.eyebrow {
    display: block;
    margin-bottom: 7px;
    color: #5f5f5f;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.18em;
}

.profile-top h1 {
    margin: 0;
    color: #f1f1f1;
    font-size: 28px;
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.035em;
}

.identity p {
    margin: 6px 0 0;
    color: #606060;
    font-size: 11px;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 24px;
}

.account-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 7px;
}

.status,
.member-since,
.session-status {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #626262;
    font-size: 10px;
}

.status.verified {
    color: #829582;
}

.session-status {
    color: #777;
}

.session-status strong {
    color: #aaa;
    font-weight: 600;
}

.logout-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    height: 37px;
    padding: 0 14px;
    flex-shrink: 0;
    border: 1px solid #343434;
    border-radius: 7px;
    background: #181818;
    color: #999;
    cursor: pointer;
    font: inherit;
    font-size: 10px;
    font-weight: 500;
    transition:
        background 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;
}

.logout-button:hover {
    border-color: #484848;
    background: #202020;
    color: #fff;
}

.settings-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    padding-top: 22px;
}

.settings-section {
    padding: 24px;
    border: 1px solid #292929;
    border-radius: 11px;
    background: #131313;
}

.password-section {
    grid-column: 1 / -1;
}

.section-title {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 22px;
}

.section-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border: 1px solid #292929;
    border-radius: 7px;
    background: #191919;
    color: #777;
}

.section-title h2 {
    margin: 1px 0 0;
    color: #d7d7d7;
    font-size: 13px;
    font-weight: 600;
}

.section-title p {
    margin: 5px 0 0;
    color: #5d5d5d;
    font-size: 10px;
}

.fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.field {
    margin-bottom: 15px;
}

.field label {
    display: block;
    margin-bottom: 7px;
    color: #858585;
    font-size: 10px;
}

.field input {
    width: 100%;
    height: 41px;
    box-sizing: border-box;
    padding: 0 11px;
    border: 1px solid #292929;
    border-radius: 7px;
    outline: none;
    background: #191919;
    color: #fff;
    font: inherit;
    font-size: 11px;
    transition: border-color 0.2s ease, background 0.2s ease;
}

.field input::placeholder {
    color: #4d4d4d;
}

.field input:hover {
    border-color: #353535;
}

.field input:focus {
    border-color: #4b4b4b;
    background: #1b1b1b;
}

.save-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    height: 37px;
    margin-top: 3px;
    padding: 0 14px;
    border: 0;
    border-radius: 7px;
    background: #eee;
    color: #111;
    cursor: pointer;
    font: inherit;
    font-size: 10px;
    font-weight: 600;
    transition:
        background 0.2s ease,
        transform 0.2s ease;
}

.save-button:hover:not(:disabled) {
    background: #fff;
}

.save-button:active:not(:disabled) {
    transform: translateY(1px);
}

.save-button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.error {
    margin: 0 0 11px;
    color: #c87878;
    font-size: 10px;
}

.success {
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 0 0 11px;
    color: #839883;
    font-size: 10px;
}

.loading,
.error-page {
    padding: 50px;
    border: 1px solid #292929;
    border-radius: 11px;
    background: #131313;
    color: #666;
    text-align: center;
    font-size: 11px;
}

.error-page {
    color: #c87878;
}

@media (max-width: 750px) {
    .profile-page {
        padding: 35px 15px 60px;
    }

    .profile-top {
        align-items: flex-start;
        flex-direction: column;
        gap: 22px;
    }

    .header-right {
        width: 100%;
        align-items: center;
        justify-content: space-between;
    }

    .account-status {
        align-items: flex-start;
    }

    .settings-layout {
        grid-template-columns: 1fr;
    }

    .password-section {
        grid-column: auto;
    }
}

@media (max-width: 500px) {
    .profile-page {
        padding-top: 25px;
    }

    .profile-top h1 {
        font-size: 24px;
    }

    .avatar {
        width: 54px;
        height: 54px;
        border-radius: 13px;
    }

    .header-right {
        align-items: flex-start;
        flex-direction: column;
        gap: 16px;
    }

    .account-status {
        gap: 6px;
    }

    .logout-button {
        width: 100%;
    }

    .settings-section {
        padding: 20px;
    }

    .fields {
        grid-template-columns: 1fr;
        gap: 0;
    }
}
</style>
