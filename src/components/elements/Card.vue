<script lang="ts" setup>
interface Properties {
    title?: string;
    paragraph?: string;
}

const props: Properties = withDefaults(defineProps<Properties>(), {
    title: "No Title",
    paragraph: "No Paragraph"
})
</script>

<template>
    <div class="text-card animate">
        <h3>{{ props.title }}</h3>
        <p>{{ props.paragraph }}</p>
    </div>
</template>

<style scoped>
.text-card {
    background: #2a2a2a;
    padding: 30px 20px;
    border-radius: 12px;
    width: 280px;
    transition: transform 0.3s, box-shadow 0.3s;
}

.text-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.text-card h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #ffffff;
}

.text-card p {
    color: #c0c0c0;
    font-size: 1rem;
    line-height: 1.5;
}

@keyframes fade_in {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate {
    opacity: 0;
    transform: translateY(30px);
    animation: fade_in 0.2s forwards;
}

.text-card.animate:nth-child(1) {
    animation-delay: 0.1s;
}

.text-card.animate:nth-child(2) {
    animation-delay: 0.2s;
}

.text-card.animate:nth-child(3) {
    animation-delay: 0.3s;
}

@media (max-width: 768px) {
    .text-card {
        width: 100%;
        max-width: 300px;
    }
}
</style>