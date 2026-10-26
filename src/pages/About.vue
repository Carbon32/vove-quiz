<script lang="ts" setup>
import PictureCard from "../components/elements/PictureCard.vue"

// Eh, random text
const paragraphs: Array<string> = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo vel lorem tincidunt facilisis. Curabitur blandit, neque at interdum posuere, justo lacus tincidunt sapien, vitae consequat erat arcu sed nisi. Donec feugiat, mauris vel tincidunt consequat, erat nulla luctus mi, vitae volutpat massa ipsum non libero.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum. Integer malesuada, sapien vel consequat tincidunt, justo erat volutpat neque, at tincidunt lacus nisl quis erat. Suspendisse potenti. Morbi consequat, libero vitae tincidunt faucibus, justo mauris malesuada ipsum, vitae tincidunt sem lorem at arcu.",
    "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. Donec consectetur, magna quis ullamcorper feugiat, libero arcu malesuada sapien, vitae tincidunt neque justo sed nisl."
]
</script>

<template>
    <section class="about-page container">
        <h1 class="about-title animate">About Us</h1>
        <PictureCard image="/about/placeholder_1.jpg" title="Morning Light" :paragraph="paragraphs[0]" />
        <PictureCard :reverse="true" image="/about/placeholder_2.jpg" title="Quiet Forest" :paragraph="paragraphs[1]" />
        <PictureCard image="/about/placeholder_3.jpg" title="Ocean Journey" :paragraph="paragraphs[2]" />
        <PictureCard :reverse="true" image="/about/placeholder_4.jpg" title="A Better Future"
            :paragraph="paragraphs[3]" />
    </section>
</template>

<style scoped>
.about-page {
    padding: 80px 20px;
    color: #e5e5e5;
}

.about-page h1 {
    font-size: 2.5rem;
    margin-bottom: 50px;
    text-align: center;
}

.animate {
    opacity: 0;
    transform: translateY(30px);
    animation: fade_in 0.2s forwards;
}

.about-title.animate {
    animation-delay: 0.2s;
}

@keyframes fade_in {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .about-page h1 {
        font-size: 2rem;
        margin-bottom: 40px;
    }
}
</style>