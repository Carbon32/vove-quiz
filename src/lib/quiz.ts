import { get_access_token } from "./api"

export interface Question {
    id: number
    category: string
    questionText: string
    options: string[]
    correctIndex: number
}


const quiz_api_origin = (import.meta.env.VITE_QUIZ_API_URL || "http://127.0.0.1:8081").replace(/\/$/, "")

export async function quiz_fetch(path: string, user_id: number, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers)
    headers.set("X-User-Id", String(user_id))

    const token = get_access_token()
    if (token) headers.set("Authorization", `Bearer ${token}`)

    if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json")
    }

    return fetch(`${quiz_api_origin}${path}`, { ...init, headers })
}