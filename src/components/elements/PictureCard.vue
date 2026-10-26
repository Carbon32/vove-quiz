<script lang="ts" setup>
interface Properties {
    image?: string;
    title?: string;
    paragraph?: string;
    reverse?: boolean;
}

const props: Properties = withDefaults(defineProps<Properties>(), {
    image: "https://placehold.co/600x400?text=Broken+Image",
    title: "No Title",
    paragraph: "No Paragraph",
    reverse: false
})

const rendering_type = (): string => props.reverse ? "card-content reverse" : "card-content"
</script>

<template>
    <div class="card-section animate">
        <div :class="rendering_type()">
            <img :src="props.image" :alt="props.title" class="card-image" />
            <div class="card-text">
                <h2>{{ props.title }}</h2>
                <p>
                    {{ props.paragraph }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-section {
    margin-bottom: 60px;
}

.card-content {
    display: flex;
    align-items: center;
    gap: 40px;
}

.card-content.reverse {
    flex-direction: row-reverse;
}

.card-image {
    width: 300px;
    height: 200px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
    flex-shrink: 0;
    transition: transform 0.3s;
}

.card-image:hover {
    transform: scale(1.05);
}

.card-text h2 {
    font-size: 1.8rem;
    margin-bottom: 15px;
    color: #ffffff;
}

.card-text p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #c0c0c0;
}

.animate {
    opacity: 0;
    transform: translateY(30px);
    animation: fade_in 1s forwards;
    animation-delay: 0.2s;
}

.animate:nth-child(2) {
    animation-delay: 0.3s;
}

.animate:nth-child(3) {
    animation-delay: 0.4s;
}

.animate:nth-child(4) {
    animation-delay: 0.5s;
}

@keyframes fade_in {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .card-page h1 {
        font-size: 2rem;
        margin-bottom: 40px;
    }

    .card-content,
    .card-content.reverse {
        flex-direction: column;
        text-align: center;
    }

    .card-image {
        width: 100%;
        max-width: 400px;
        height: auto;
    }

    .card-text h2 {
        font-size: 1.5rem;
    }

    .card-text p {
        font-size: 1rem;
    }
}
</style>