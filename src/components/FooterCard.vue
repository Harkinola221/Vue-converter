<template>
  <div
    class="p-6 border-t bg-black border-muted-foreground/10 text-center space-y-2"
  >
    <p class="text-muted-foreground">All right reserved.</p>
    <p class="text-muted-foreground">Made with ❤️ by Michael Olabisi @ {{ yearCreated }}</p>
  </div>
</template>

<script setup>
const yearCreated = new Date().getFullYear();
</script>

<style scoped></style>
