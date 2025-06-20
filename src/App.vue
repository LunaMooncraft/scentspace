<script setup lang="ts">
import Notes from '@/components/Notes.vue';
import Perfumes from '@/components/Perfumes.vue';
</script>

<template>
  <main>
    <div class="flex gap-3 items-center">
      <img
        class="logo"
        src="./assets/logo.svg"
        width="28"
        height="28"
      >
      <p>ScentSpace</p>
    </div>

    <div class="flex flex-col">
      <div class="mb-4">
        <Notes />
      </div>
      <div>
        <Perfumes />
      </div>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}
</style>
