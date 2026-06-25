<template>
  <iframe
    :src="iframeUrl"
    class="fullscreen-iframe"
    frameborder="0"
    allowfullscreen
  ></iframe>
</template>

<script setup>
const iframeUrl = "https://app.powerbi.com/view?r=eyJrIjoiNjY2MTZjMTgtNzc4Yy00YzAyLTlkMmEtMWVkYTgzYzU2NWQxIiwidCI6ImZkYjg1NTk5LTlkNmMtNDk3OC1iOTU3LTVkMTk5ZGViN2Y0NiIsImMiOjZ9"
</script>

<style scoped>
.fullscreen-iframe {
  width: 100%;
  height: 90vh;
  border: none;
}

</style>
