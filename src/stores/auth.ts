import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { api_fetch, clear_tokens, get_access_token, read_response, save_tokens } from "../lib/api"

export interface User {
    id: number
    first_name: string
    last_name: string
    username: string
    email: string
}

type token_pair = { access_token: string; refresh_token: string; expires_at?: string }

export const useAuthStore = defineStore("auth", () => {
    const user = ref<User | null>(null)
    const loading = ref(true)
    const is_authenticated = computed(() => user.value !== null)

    async function check_auth(): Promise<boolean> {
        if (!get_access_token()) {
            user.value = null
            loading.value = false
            return false
        }
        try {
            const response = await api_fetch("/user/me")
            if (!response.ok) {
                if (response.status === 401) clear_tokens()
                user.value = null
                return false
            }
            user.value = await read_response<User>(response)
            return true
        } catch (error) {
            console.error("Authentication check failed:", error)
            user.value = null
            return false
        } finally {
            loading.value = false
        }
    }

    function sign_in(tokens: token_pair, remember: boolean): void {
        save_tokens(tokens, remember)
    }

    function set_user(new_user: User): void {
        user.value = new_user
    }

    async function logout(): Promise<void> {
        if (get_access_token()) {
            try {
                await api_fetch("/user/logout", { method: "POST" })
            } catch (error) {
                console.error("Could not revoke the server session:", error)
            }
        }
        clear_tokens()
        user.value = null
    }

    function clear_session(): void {
        clear_tokens()
        user.value = null
    }

    return { user, loading, is_authenticated, check_auth, sign_in, set_user, logout, clear_session }
})
