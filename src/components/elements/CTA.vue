<script lang="ts" setup>
interface Properties {
    title?: string;
    paragraph?: string;
    link?: string;
    button?: string;
}

const props: Properties = withDefaults(defineProps<Properties>(), {
    title: "No Title",
    paragraph: "No Paragraph",
    link: "",
    button: "No Text"
})

const path = (): string => "/" + props.link
</script>

<template>
    <section class="cta">
        <div class="cta-content container animate">
            <h1 class="cta-title">{{ props.title }}</h1>
            <p class="cta-subtitle">
                {{ props.paragraph }}
            </p>
            <RouterLink :to="path()" class="cta-button">{{ props.button }}</RouterLink>
        </div>
    </section>
</template>

<style scoped>
.cta {
    background: #1e1e1e;
    color: #f5f5f5;
    padding: 100px 20px 80px;
    text-align: center;
}

.cta-title {
    font-size: 3rem;
    margin-bottom: 20px;
}

.cta-subtitle {
    font-size: 1.25rem;
    margin-bottom: 30px;
    color: #c0c0c0;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}

.cta-button {
    border: none;
    background: #303030;
    color: white;
    border-radius: 12px;
    padding: 16px 32px;
    cursor: pointer;
    transition: .2s;
}

.cta-button:hover {
    background: #ffffff;
    color: #1e1e1e;
}

.animate {
    opacity: 0;
    transform: translateY(30px);
    animation: fade_in 0.2s forwards;
}

.cta-content.animate {
    animation-delay: 0.2s;
}

@keyframes fade_in {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .cta-title {
        font-size: 2.2rem;
    }

    .cta-subtitle {
        font-size: 1.1rem;
    }
}
</style>