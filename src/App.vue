<script lang="ts" setup>
import Navigation from './components/layout/Navigation.vue'
import AdvancedFooter from './components/layout/AdvancedFooter.vue'
</script>

<template>
    <Navigation />
    <main>
        <RouterView />
    </main>
    <AdvancedFooter />
</template>