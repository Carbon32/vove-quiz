const api_origin = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8080").replace(/\/$/, "")

type token_pair = { access_token: string; refresh_token: string; expires_at?: string }
let refresh_in_flight: Promise<boolean> | null = null

function storage_with_refresh_token(): Storage | null {
    if (typeof window === "undefined") return null
    if (localStorage.getItem("refresh_token")) return localStorage
    if (sessionStorage.getItem("refresh_token")) return sessionStorage
    return null
}

export function get_access_token(): string | null {
    return localStorage.getItem("access_token") || sessionStorage.getItem("access_token")
}

export function get_session_expiry(): string | null {
    return localStorage.getItem("session_expires_at") || sessionStorage.getItem("session_expires_at")
}

export function save_tokens(tokens: token_pair, remember = false): void {
    clear_tokens()
    const storage = remember ? localStorage : sessionStorage
    storage.setItem("access_token", tokens.access_token)
    storage.setItem("refresh_token", tokens.refresh_token)
    if (tokens.expires_at) storage.setItem("session_expires_at", tokens.expires_at)
}

export function clear_tokens(): void {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("session_expires_at")
    sessionStorage.removeItem("access_token")
    sessionStorage.removeItem("refresh_token")
    sessionStorage.removeItem("session_expires_at")
}

async function refresh_tokens(): Promise<boolean> {
    if (refresh_in_flight) return refresh_in_flight
    refresh_in_flight = perform_refresh()
    try {
        return await refresh_in_flight
    } finally {
        refresh_in_flight = null
    }
}

async function perform_refresh(): Promise<boolean> {
    const storage = storage_with_refresh_token()
    const refresh_token = storage?.getItem("refresh_token")
    if (!storage || !refresh_token) return false

    try {
        const response = await fetch(`${api_origin}/api/v1/session/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token }),
        })
        if (!response.ok) {
            clear_tokens()
            return false
        }
        const tokens = await response.json() as token_pair
        storage.setItem("access_token", tokens.access_token)
        storage.setItem("refresh_token", tokens.refresh_token)
        if (tokens.expires_at) storage.setItem("session_expires_at", tokens.expires_at)
        return true
    } catch {
        return false
    }
}

export async function api_fetch(path: string, init: RequestInit = {}, retry = true): Promise<Response> {
    const headers = new Headers(init.headers)
    if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json")
    }
    const token = get_access_token()
    if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`)

    const response = await fetch(`${api_origin}/api/v1${path}`, { ...init, headers })
    if (response.status !== 401 || !retry || !(await refresh_tokens())) return response

    const retry_headers = new Headers(init.headers)
    if (init.body && !(init.body instanceof FormData) && !retry_headers.has("Content-Type")) {
        retry_headers.set("Content-Type", "application/json")
    }
    const fresh_token = get_access_token()
    if (fresh_token) retry_headers.set("Authorization", `Bearer ${fresh_token}`)
    return fetch(`${api_origin}/api/v1${path}`, { ...init, headers: retry_headers })
}

export async function read_response<response_type = Record<string, unknown>>(response: Response): Promise<response_type> {
    const text = await response.text()
    if (!text) return {} as response_type
    try {
        return JSON.parse(text) as response_type
    } catch {
        return { error: text } as response_type
    }
}

export function response_error(data: unknown, fallback: string): string {
    if (data && typeof data === "object") {
        const record = data as Record<string, unknown>
        if (typeof record.error === "string") return record.error
        if (typeof record.message === "string") return record.message
    }
    if (typeof data === "string" && data) return data
    return fallback
}
