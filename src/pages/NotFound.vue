<script lang="ts" setup>
import { ArrowLeft, Home } from "lucide-vue-next"
</script>

<template>
    <main class="error-page">
        <div class="error-container container animate">

            <div class="error-code">
                404
            </div>

            <div class="error-content">
                <p class="error-eyebrow">PAGE NOT FOUND</p>

                <h1>
                    Looks like you're lost.
                </h1>

                <p class="error-description">
                    The page you're looking for doesn't exist, has been moved,
                    or the link may be incorrect.
                </p>

                <div class="error-actions">
                    <a href="/" class="primary-button">
                        <Home :size="17" />
                        Go home
                    </a>

                    <button class="secondary-button" @click="$router.back()">
                        <ArrowLeft :size="17" />
                        Go back
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.error-page {
    min-height: calc(100vh - 70px);
    display: flex;
    align-items: center;
    justify-content: center;

    background: #181818;
    color: #c0c0c0;

    padding: 80px 20px;
    font-family: "Inter", sans-serif;
}

.animate {
    opacity: 0;
    transform: translateY(30px);
    animation: fade_in 0.2s forwards;
}

.error-container.animate {
    animation-delay: 0.2s;
}

@keyframes fade_in {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.error-container {
    width: 100%;
    max-width: 900px;

    display: flex;
    flex-direction: column;
    align-items: center;

    text-align: center;
}

.error-code {
    color: #292929;
    font-size: clamp(7rem, 22vw, 14rem);
    font-weight: 800;
    line-height: 0.8;
    letter-spacing: -0.08em;

    user-select: none;
}

.error-content {
    position: relative;
    margin-top: -15px;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.error-eyebrow {
    margin: 0 0 12px;

    color: #888;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.16em;
}

h1 {
    margin: 0;

    color: #fff;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    letter-spacing: -0.04em;
}

.error-description {
    max-width: 500px;
    margin: 18px 0 0;

    color: #858585;
    font-size: 0.95rem;
    line-height: 1.7;
}

.error-actions {
    display: flex;
    align-items: center;
    gap: 12px;

    margin-top: 30px;
}

.primary-button,
.secondary-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    min-height: 42px;
    padding: 0 18px;

    border-radius: 8px;

    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 500;

    text-decoration: none;
    cursor: pointer;

    transition:
        background 0.2s ease,
        color 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease;
}

.primary-button {
    color: #181818;
    background: #fff;
    border: 1px solid #fff;
}

.primary-button:hover {
    background: #ddd;
    border-color: #ddd;
    transform: translateY(-1px);
}

.secondary-button {
    color: #aaa;
    background: transparent;
    border: 1px solid #353535;
}

.secondary-button:hover {
    color: #fff;
    border-color: #505050;
    background: #222;
    transform: translateY(-1px);
}

@media (max-width: 600px) {
    .error-page {
        min-height: calc(100vh - 60px);
        padding: 60px 20px;
    }

    .error-code {
        font-size: 8rem;
    }

    .error-content {
        margin-top: -5px;
    }

    .error-description {
        font-size: 0.9rem;
    }

    .error-actions {
        width: 100%;
        flex-direction: column;
    }

    .primary-button,
    .secondary-button {
        width: 100%;
        max-width: 250px;
    }
}
</style>