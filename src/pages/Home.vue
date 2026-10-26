<script lang="ts" setup>

import Card from '../components/elements/Card.vue'
import CardGrid from '../components/elements/CardGrid.vue'
import CTA from '../components/elements/CTA.vue'
import { useI18n } from "vue-i18n"

// NOTE: Only this page is available in three languages, if you want to add more, just modify the translation files 
const { t } = useI18n()

</script>

<template>
    <CTA :title="t('home.title')" :paragraph="t('home.subtitle')" link="about" :button="t('home.button')" />

    <CardGrid :title="t('home.qa')">
        <Card :title="t('home.q_1')" :paragraph="t('home.answer_1')" />
        <Card :title="t('home.q_2')" :paragraph="t('home.answer_2')" />
        <Card :title="t('home.q_3')" :paragraph="t('home.answer_3')" />
    </CardGrid>
</template>