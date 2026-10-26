<script lang="ts" setup>
interface Properties {
    title?: string;
}

const props: Properties = withDefaults(defineProps<Properties>(), {
    title: "No Title"
})
</script>

<template>
    <section class="section container">
        <h2 class="section-title animate">{{ props.title }}</h2>
        <div class="section-cards">
            <slot></slot>
        </div>
    </section>
</template>

<style scoped>
.section {
    padding: 80px 20px;
    text-align: center;
}

.section-title {
    font-size: 2rem;
    margin-bottom: 50px;
    color: #ffffff;
}

.section-cards {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    justify-content: center;
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

.section-title.animate {
    animation-delay: 0.4s;
}

@media (max-width: 768px) {
    .section-title {
        font-size: 1.6rem;
        margin-bottom: 30px;
    }
}
</style>